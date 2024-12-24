import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.kategoriTb.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  await prisma.kategoriTb.create({
    data: {
      nama: String(formData.get("nama")),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ pesan: "sukses" });
}
