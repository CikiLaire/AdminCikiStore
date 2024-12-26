"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingButton from "../components/loadingButton";
import { formatTanggal, formatRupiah } from "@/lib/func";

interface LaporanPenjualan {
  id: number;
  namaBarang: string;
  kategori: string;
  namaPelanggan: string;
  tanggal: string;
  hargaModal: number;
  hargaJual: number;
  status: string;
}

const LaporanPage = () => {
  const [data, setData] = useState<LaporanPenjualan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pesan, setPesan] = useState("");
  const [isSukses, setIsSukses] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/penjualan");
      const data = res.data;
      setData(data);
    } catch (error) {
      console.log("error", error);
      setIsError(true);
      setPesan("Terjadi Kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProduk = data.filter(
    (item) =>
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);
  const paginatedData = filteredProduk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {isError && (
        <div className="toast">
          <div className="alert alert-error">
            <span className="text-white">{pesan}</span>
          </div>
        </div>
      )}
      {isSukses && (
        <div className="toast">
          <div className="alert alert-success">
            <span className="text-white">{pesan}</span>
          </div>
        </div>
      )}
      <div className="border border-slate-700/30 p-5 rounded-md">
        <div className="md:flex items-center justify-between mb-5">
          <h1 className="text-xl text-white">Laporan Penjualan</h1>
          <div className="input-group w-full lg:w-[400px]">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Cari nama produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Tanggal</th>
                <th>Nama Pelanggan</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Pendapatan</th>
                <th>Modal</th>
                <th>Untung</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    <LoadingButton />
                  </td>
                </tr>
              ) : filteredProduk.length === 0 ? (
                <tr className="hover">
                  <td colSpan={9} className="text-center">
                    Belum ada penjualan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      item.status === "Belum Lunas" ? "bg-red-100/10" : ""
                    }`}
                  >
                    <th>{(currentPage - 1) * itemsPerPage + index + 1}</th>
                    <td>{item.namaBarang}</td>
                    <td>{formatTanggal(item.tanggal)}</td>
                    <td>{item.namaPelanggan}</td>
                    <td>{item.kategori}</td>
                    <td>{item.status}</td>
                    <td>{formatRupiah(item.hargaJual)}</td>
                    <td>{formatRupiah(item.hargaModal)}</td>
                    <td>{formatRupiah(item.hargaJual - item.hargaModal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-5">
          <div className="join">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`join-item btn ${
                  currentPage === index + 1 ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanPage;
