import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cikistore | Detail Produk",
  description:
    "Halaman detail produk Cikistore untuk mengelola data item produk.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
