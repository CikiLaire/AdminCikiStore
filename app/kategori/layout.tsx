import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cikistore | Kategori",
  description: "Halaman kategori Cikistore untuk mengelola kategori produk.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
