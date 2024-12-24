import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = params.id;

  const data = await prisma.listProdukTb.findMany({
    where: {
      produkId: Number(id),
    },
    include: {
      ProdukTb: true,
      KategoriTb: true,
    },
  });

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  if (!params) {
    return NextResponse.json({ error: "Params not found" }, { status: 400 });
  }

  const id = params.id;
  const { nama, hargaModal, hargaJual, kategoriId, produkId } =
    await request.json();

  await prisma.listProdukTb.update({
    where: {
      id: Number(id),
    },
    data: {
      nama: nama,
      hargaModal: Number(hargaModal),
      hargaJual: Number(hargaJual),
      kategoriId: Number(kategoriId),
      produkId: Number(produkId),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ pesan: "sukses" });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  if (!params) {
    return NextResponse.json({ error: "Params not found" }, { status: 400 });
  }

  const id = params.id;

  await prisma.listProdukTb.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({ pesan: "sukses" });
}