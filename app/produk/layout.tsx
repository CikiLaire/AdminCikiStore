import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cikistore | Produk",
  description: "Halaman produk Cikistore untuk mengelola data produk.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
