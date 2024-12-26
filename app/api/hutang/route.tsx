import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.hutangTb.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(data);
}
