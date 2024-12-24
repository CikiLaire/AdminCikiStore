"use client";
import LoadingButton from "@/app/components/loadingButton";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Kategori {
  id: number;
  nama: string;
}

interface TambahProps {
  reload: Function;
  isError: Function;
  setPesan: Function;
  isSukses: Function;
  eprodukId: number;
}

const Tambah = ({
  reload,
  isError,
  setPesan,
  isSukses,
  eprodukId,
}: TambahProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(false);
  const [kategoriNama, setKategoriNama] = useState<string>("");

  const [nama, setNama] = useState("");
  const [kategoriId, setKategoriId] = useState<string>("");
  const [hargaModal, setHargaModal] = useState("0");
  const [hargaJual, setHargaJual] = useState("0");
  const [produkId, setProdukId] = useState(eprodukId);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadKategori();
  }, []);

  const loadKategori = async () => {
    try {
      const res = await axios.get("/api/kategori");
      const data = res.data;
      setKategori(data);
    } catch (error) {
      console.log("Gagal mengambil data");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nama) {
      newErrors.nama = "Nama Item tidak boleh kosong";
    }

    if (!kategoriId) {
      newErrors.kategoriId = "Kategori harus dipilih";
    }

    if (!hargaModal || isNaN(Number(hargaModal)) || Number(hargaModal) <= 0) {
      newErrors.hargaModal =
        "Modal harus berupa angka yang valid dan lebih besar dari 0";
    }

    if (
      !hargaJual ||
      isNaN(Number(hargaJual)) ||
      Number(hargaJual) <= 0 ||
      (kategoriNama !== "Uang Elektronik" &&
        kategoriNama !== "Pulsa" &&
        !hargaJual)
    ) {
      newErrors.hargaJual =
        "Harga Jual harus berupa angka yang valid dan lebih besar dari 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("kategoriId", kategoriId);
      formData.append("hargaModal", hargaModal);
      formData.append("hargaJual", hargaJual);
      formData.append("produkId", produkId.toString());

      const res = await axios.post("/api/detailProduk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.pesan === "sukses") {
        setIsOpen(false);
        reload();
        clearForm();
        isError(false);
        isSukses(true);
        setPesan("Data berhasil disimpan.");
      } else {
        setIsOpen(false);
        isError(true);
        isSukses(false);
        setPesan("Data gagal disimpan.");
      }
    } catch (error) {
      console.log("error", error);
      setIsOpen(false);
      isError(true);
      isSukses(false);
      setPesan("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setNama("");
    setHargaModal("");
    setHargaJual("");
    setKategoriId("");
    setErrors({});
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleHargaModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHargaModal(value === "" ? "" : value);
    if (value) {
      if (kategoriNama !== "Uang Elektronik" && kategoriNama !== "Pulsa") {
        setHargaJual(
          Math.round(Number(value) + Number(value) * 0.03).toString()
        );
      }
    } else {
      setHargaJual("0");
    }
  };

  const handleKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setKategoriId(selectedId);

    const selectedCategory = kategori.find(
      (item) => item.id.toString() === selectedId
    );
    if (selectedCategory) {
      setKategoriNama(selectedCategory.nama);
    }

    if (
      selectedCategory &&
      (selectedCategory.nama === "Uang Elektronik" ||
        selectedCategory.nama === "Pulsa")
    ) {
      setHargaJual("");
    } else {
      setHargaJual(
        Math.round(Number(hargaModal) + Number(hargaModal) * 0.03).toString()
      );
    }
  };

  return (
    <div>
      <button className="btn btn-neutral" onClick={handleModal}>
        Tambah
      </button>
      <dialog id="my_modal_1" className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-5">Tambah Item!</h3>
          <form onSubmit={handleTambah}>
            <div className="mb-3">
              <label className="label">Nama Item</label>
              <input
                type="text"
                placeholder="Nama Item"
                className="input input-bordered w-full"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
              {errors.nama && (
                <span className="text-red-500 text-sm">{errors.nama}</span>
              )}
            </div>
            <div className="mb-3">
              <label className="label">Kategori</label>
              <select
                className="select select-bordered w-full"
                value={kategoriId}
                onChange={handleKategoriChange}
              >
                <option disabled selected value={""}>
                  Pilih Kategori
                </option>
                {kategori.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
              {errors.kategoriId && (
                <span className="text-red-500 text-sm">
                  {errors.kategoriId}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label className="label">Modal</label>
              <label className="input input-bordered flex items-center gap-2">
                Rp
                <input
                  type="text"
                  className="grow"
                  placeholder="Modal"
                  value={hargaModal}
                  onChange={handleHargaModalChange}
                />
              </label>
              {errors.hargaModal && (
                <span className="text-red-500 text-sm">
                  {errors.hargaModal}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label className="label">Harga Jual</label>
              <label className="input input-bordered flex items-center gap-2">
                Rp
                <input
                  type="text"
                  className="grow"
                  placeholder="Harga Jual"
                  value={hargaJual}
                  onChange={(e) => setHargaJual(e.target.value)}
                  readOnly={
                    kategoriNama === "Uang Elektronik" ||
                    kategoriNama === "Pulsa"
                      ? false
                      : true
                  }
                />
              </label>
              {errors.hargaJual && (
                <span className="text-red-500 text-sm">{errors.hargaJual}</span>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" type="button" onClick={handleModal}>
                Tutup
              </button>
              <button className="btn btn-primary text-white" type="submit">
                {loading ? <LoadingButton /> : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Tambah;
