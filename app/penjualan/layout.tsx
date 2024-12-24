import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cikistore | Penjualan",
  description: "Halaman penjualan Cikistore untuk mengelola penjualan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
