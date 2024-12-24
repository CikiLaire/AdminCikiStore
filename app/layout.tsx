import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Header from "./components/header";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cikistore | Dashboard",
  description: "Halaman dashboard Cikistore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="flex">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="lg:ml-64 flex-grow min-h-screen">
            <Header />
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
