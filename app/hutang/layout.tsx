import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cikistore | Hutang",
  description: "Halaman hutang Cikistore untuk mengelola data hutang.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
