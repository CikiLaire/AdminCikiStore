"use client";
import { useEffect, useState } from "react";

export default function DashboardAdmin() {
  const [penjualan, setPenjualan] = useState(0);
  const [untung, setUntung] = useState(0);
  const [pelanggan, setPelanggan] = useState(0);
  const [produk, setProduk] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        setPenjualan(data.totalPenjualan);
        setUntung(data.totalUntung);
        setPelanggan(data.totalPelanggan);
        setProduk(data.totalProduk);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Dashboard Admin</h1>
          <p>Selamat datang di Cikistore Admin Dashboard</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-slate-700/30 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Total Penjualan</h2>
            <p className="mt-2 text-2xl font-bold text-green-500">
              Rp {penjualan.toLocaleString()}
            </p>
          </div>
          <div className="p-6 border border-slate-700/30 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Total Untung</h2>
            <p className="mt-2 text-2xl font-bold text-blue-500">
              Rp {untung.toLocaleString()}
            </p>
          </div>
          <div className="p-6 border border-slate-700/30 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Total Pelanggan</h2>
            <p className="mt-2 text-2xl font-bold text-purple-500">
              {pelanggan}
            </p>
          </div>
          <div className="p-6 border border-slate-700/30 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Total Produk</h2>
            <p className="mt-2 text-2xl font-bold text-yellow-500">{produk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
