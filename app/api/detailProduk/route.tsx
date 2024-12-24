import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();

  await prisma.listProdukTb.create({
    data: {
      nama: String(formData.get("nama")),
      hargaModal: Number(formData.get("hargaModal")),
      hargaJual: Number(formData.get("hargaJual")),
      kategoriId: Number(formData.get("kategoriId")),
      produkId: Number(formData.get("produkId")),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ pesan: "sukses" });
}
