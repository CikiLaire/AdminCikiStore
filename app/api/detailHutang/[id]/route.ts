import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const hutang = await prisma.hutangTb.findUnique({
    where: { id: Number(id) },
    include: {
      Cicilan: true,
    },
  });

  return NextResponse.json(hutang);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const formData = await req.formData();

  const sisaHutang = await prisma.hutangTb.findFirst({
    where: {
      id: Number(id),
    },
    select: {
      sisa: true,
      nama: true,
    },
  });

  // Buat cicilan baru
  await prisma.cicilan.create({
    data: {
      hutangId: Number(id),
      jumlah: Number(formData.get("jumlah")),
      tanggal: String(formData.get("tanggal")),
      updatedAt: new Date(),
    },
  });

  // Update nilai sisa hutang
  const updatedHutang = await prisma.hutangTb.update({
    where: {
      id: Number(id),
    },
    data: {
      sisa: Number(formData.get("sisa")),
    },
  });

  if (updatedHutang.sisa === 0) {
    await prisma.penjualanTb.updateMany({
      where: {
        namaPelanggan: sisaHutang?.nama,
      },
      data: {
        status: "Lunas",
      },
    });

    // Hapus cicilan dan hutang terkait
    await prisma.cicilan.deleteMany({
      where: {
        hutangId: Number(id),
      },
    });
    await prisma.hutangTb.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ pesan: "sukses", redirect: "/laporan" });
  }

  return NextResponse.json({ pesan: "sukses" });
}
