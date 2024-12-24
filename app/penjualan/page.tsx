"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "../components/loadingButton";

interface Produk {
  id: number;
  nama: string;
}

interface ListProduk {
  id: number;
  nama: string;
  hargaModal: number;
  hargaJual: number;
  KategoriTb: {
    id: number;
    nama: string;
  };
}

interface User {
  id: number;
  nama: string;
}

const PenjualanPage = () => {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [listProduk, setListProduk] = useState<ListProduk[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [produkId, setProdukId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);

  const [isError, setIsError] = useState(false);
  const [isSukses, setIsSukses] = useState(false);
  const [pesan, setPesan] = useState("");

  const [tanggal, setTanggal] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState(""); // State for storing selected customer name
  const [namaBarang, setNamaBarang] = useState("");
  const [kategori, setKategori] = useState("");
  const [hargaModal, setHargaModal] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);
  const [status, setStatus] = useState("");

  // State for storing added items to display in table
  const [tabelData, setTabelData] = useState<any[]>([]);

  useEffect(() => {
    loadProduk();
    loadUser();
  }, []);

  useEffect(() => {
    if (produkId) {
      loadListProduk(produkId);
    } else {
      setListProduk([]);
    }
  }, [produkId]);

  const loadProduk = async () => {
    try {
      const res = await axios.get("/api/produk");
      const data = res.data;
      setProduk(data);
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    }
  };

  const loadListProduk = async (id: string) => {
    try {
      const res = await axios.get(`/api/detailProduk/${id}`);
      const data = res.data;
      setListProduk(data);
    } catch (error) {
      console.error("Gagal memuat detail produk:", error);
    }
  };

  const loadUser = async () => {
    try {
      const res = await axios.get(`/api/user`);
      const data = res.data;
      setUser(data);
    } catch (error) {
      console.error("Gagal memuat user:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setIsInputDisabled(false);
      setIsSelectDisabled(true);
      setNamaPelanggan(e.target.value); // Update namaPelanggan state with input value
    } else {
      setIsInputDisabled(true);
      setIsSelectDisabled(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsInputDisabled(true);
    setIsSelectDisabled(false);
    setNamaPelanggan(e.target.value);
  };

  const handleItemSelect = (id: number) => {
    const selectedItem = listProduk.find((item) => item.id === id);
    if (selectedItem) {
      setNamaBarang(selectedItem.nama);
      setKategori(selectedItem.KategoriTb.nama);
      setHargaModal(selectedItem.hargaModal);
      setHargaJual(selectedItem.hargaJual);
    }
  };

  const simpanData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tanggalFormat = new Date(tanggal).toISOString();
      const formData = new FormData();
      formData.append("tanggal", tanggalFormat);
      formData.append("namaPelanggan", namaPelanggan);
      formData.append("namaBarang", namaBarang);
      formData.append("kategori", kategori);
      formData.append("hargaModal", hargaModal.toString());
      formData.append("hargaJual", hargaJual.toString());
      formData.append("status", status);

      const res = await axios.post("/api/penjualan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.pesan === "sukses") {
        if (status === "Belum Lunas") {
          router.push("/hutang");
        } else {
          router.refresh();
          router.push("/laporan");
        }
      } else {
        setIsError(true);
        setPesan("Gagal menambahkan data.");
        setIsSukses(false);
      }
    } catch (error) {
      setIsError(true);
      setPesan("Gagal terhubung ke server.");
      setIsSukses(false);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-white text-xl">Penjualan</h1>
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          onSubmit={simpanData}
        >
          <div className="w-full mt-5">
            <label className="label">Tanggal</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
          <div className="w-full mt-5">
            <label className="label">Nama Pelanggan</label>
            <div className="flex gap-3">
              <input
                type="text"
                className="input input-bordered w-full"
                value={namaPelanggan}
                onChange={handleInputChange}
                disabled={isInputDisabled}
              />
              <select
                className="select select-bordered w-full"
                onChange={handleSelectChange}
                disabled={isSelectDisabled}
                value={namaPelanggan}
              >
                <option disabled selected value={""}>
                  Nama Pelanggan
                </option>
                {user.map((item) => (
                  <option key={item.id} value={item.nama}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full mt-5">
            <label className="label">Produk</label>
            <select
              className="select select-bordered w-full"
              value={produkId}
              onChange={(e) => setProdukId(e.target.value)}
            >
              <option disabled selected value={""}>
                Pilih Produk
              </option>
              {produk.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full mt-5">
            <label className="label">Item Produk</label>
            <select
              className="select select-bordered w-full"
              onChange={(e) => handleItemSelect(Number(e.target.value))}
            >
              <option disabled selected value={""}>
                Pilih Item
              </option>
              {listProduk.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full mt-5">
            <label className="label">Kategori</label>
            <input
              type="text"
              className="input input-bordered w-full"
              readOnly
              value={kategori}
            />
          </div>
          <div className="w-full mt-5">
            <label className="label">Modal</label>
            <label className="input input-bordered flex items-center gap-2">
              Rp
              <input type="text" className="grow" readOnly value={hargaModal} />
            </label>
          </div>
          <div className="w-full mt-5">
            <label className="label">Pendapatan</label>
            <label className="input input-bordered flex items-center gap-2">
              Rp
              <input type="text" className="grow" readOnly value={hargaJual} />
            </label>
          </div>
          <div className="w-full mt-5">
            <label className="label">Status</label>
            <select
              className="select select-bordered w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option disabled selected value={""}>
                Pilih Status
              </option>
              <option value={"Lunas"}>Lunas</option>
              <option value={"Belum Lunas"}>Belum Lunas</option>
            </select>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="flex justify-end">
            <button className="btn btn-primary mt-5" type="submit">
              {loading ? <LoadingButton /> : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PenjualanPage;
