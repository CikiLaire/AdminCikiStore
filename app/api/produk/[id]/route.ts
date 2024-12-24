import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  if (!params) {
    return NextResponse.json({ error: "Params not found" }, { status: 400 });
  }

  const id = params.id;
  const { nama } = await request.json();

  await prisma.produkTb.update({
    where: {
      id: Number(id),
    },
    data: {
      nama: nama,
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

  await prisma.produkTb.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({ pesan: "sukses" });
}
