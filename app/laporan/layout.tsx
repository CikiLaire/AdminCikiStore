import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cikistore | Laporan Penjualan",
  description:
    "Halaman laporan penjualan Cikistore untuk menampilkan hasil penjualan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
