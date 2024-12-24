import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalPenjualan = await prisma.penjualanTb.aggregate({
      _sum: {
        hargaJual: true,
      },
    });

    const totalUntung = await prisma.penjualanTb.aggregate({
      _sum: {
        hargaJual: true,
        hargaModal: true,
      },
    });

    const totalPelanggan = await prisma.userTb.count();

    const totalProduk = await prisma.produkTb.count();

    return new Response(
      JSON.stringify({
        totalPenjualan: totalPenjualan._sum?.hargaJual || 0,
        totalUntung:
          (totalUntung._sum?.hargaJual ?? 0) -
            (totalUntung._sum?.hargaModal ?? 0) || 0,
        totalPelanggan,
        totalProduk,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat mengambil data" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
