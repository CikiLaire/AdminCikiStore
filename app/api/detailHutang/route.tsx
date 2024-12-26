import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.cicilan.findMany({
    orderBy: {
      tanggal: "desc",
    },
  });

  return NextResponse.json(data);
}
