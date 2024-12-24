import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.penjualanTb.findMany({
    orderBy: {
      tanggal: "desc",
    },
  });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  await prisma.penjualanTb.create({
    data: {
      namaBarang: String(formData.get("namaBarang")),
      kategori: String(formData.get("kategori")),
      namaPelanggan: String(formData.get("namaPelanggan")),
      tanggal: String(formData.get("tanggal")),
      hargaModal: Number(formData.get("hargaModal")),
      hargaJual: Number(formData.get("hargaJual")),
      status: String(formData.get("status")),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (formData.get("status") === "Belum Lunas") {
    await prisma.hutangTb.create({
      data: {
        hutang: Number(formData.get("hargaJual")),
        nama: String(formData.get("namaPelanggan")),
        tanggal: String(formData.get("tanggal")),
        sisa: Number(formData.get("hargaJual")),
        updatedAt: new Date(),
      },
    });
  }

  const existingUser = await prisma.userTb.findFirst({
    where: {
      nama: String(formData.get("namaPelanggan")),
    },
  });

  if (!existingUser) {
    await prisma.userTb.create({
      data: {
        nama: String(formData.get("namaPelanggan")),
        updatedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ pesan: "sukses" });
}
