"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingButton from "@/app/components/loadingButton";
import axios from "axios";
import Tambah from "./components/tambah";
import Hapus from "./components/hapus";
import Edit from "./components/edit";
import { formatRupiah } from "@/lib/func";

interface ListProduk {
  id: number;
  nama: string;
  hargaModal: number;
  hargaJual: number;
  ProdukTb: {
    id: number;
    nama: string;
  };
  KategoriTb: {
    id: number;
    nama: string;
  };
}

const DetailProduk = () => {
  const [data, setData] = useState<ListProduk[]>([]);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pesan, setPesan] = useState("");
  const [isSukses, setIsSukses] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (isError || isSukses) {
      const timer = setTimeout(() => {
        setIsError(false);
        setIsSukses(false);
        setPesan(""); // Reset pesan
      }, 3000); // Toast will disappear after 3 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [isError, isSukses]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/detailProduk/${id}`);
      const data = res.data;
      setData(data);
    } catch (error) {
      console.log("Gagal mengambil data");
      setIsError(true);
      setPesan("Terjadi Kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
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
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl text-white">List Item</h1>
          <div className="lg:hidden flex justify-end">
            <Tambah
              reload={loadData}
              isError={setIsError}
              setPesan={setPesan}
              isSukses={setIsSukses}
              eprodukId={Number(id)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="hidden lg:block">
            <Tambah
              reload={loadData}
              isError={setIsError}
              setPesan={setPesan}
              isSukses={setIsSukses}
              eprodukId={Number(id)}
            />
          </div>
          <div className="input-group w-full lg:w-[400px]">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Cari nama item..."
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

        <div className="overflow-x-auto mt-5 w-full">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Modal</th>
                <th>Harga Jual</th>
                <th>Untung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    <LoadingButton />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr className="hover">
                  <td colSpan={7} className="text-center">
                    Belum ada item produk.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover">
                    <th>{(currentPage - 1) * itemsPerPage + index + 1}</th>
                    <td>{item.nama}</td>
                    <td>{item.KategoriTb.nama}</td>
                    <td>{formatRupiah(item.hargaModal)}</td>
                    <td>{formatRupiah(item.hargaJual)}</td>
                    <td>{formatRupiah(item.hargaJual - item.hargaModal)}</td>
                    <td className="flex gap-2 items-center">
                      <Edit
                        reload={loadData}
                        isError={setIsError}
                        setPesan={setPesan}
                        isSukses={setIsSukses}
                        eprodukId={Number(id)}
                        enama={item.nama}
                        ekategoriId={item.KategoriTb.id}
                        ehargaModal={item.hargaModal}
                        ehargaJual={item.hargaJual}
                        id={item.id}
                      />
                      <Hapus
                        reload={loadData}
                        isError={setIsError}
                        setPesan={setPesan}
                        isSukses={setIsSukses}
                        id={item.id}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
    </div>
  );
};

export default DetailProduk;
