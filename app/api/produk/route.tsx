import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();

  await prisma.produkTb.create({
    data: {
      nama: String(formData.get("nama")),
      kategori: String(formData.get("kategori")),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ pesan: "sukses" });
}

export async function GET() {
  const data = await prisma.produkTb.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(data);
}
