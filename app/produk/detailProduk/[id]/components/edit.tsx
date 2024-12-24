"use client";
import LoadingButton from "@/app/components/loadingButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";

interface Kategori {
  id: number;
  nama: string;
}

interface EditProps {
  reload: Function;
  isError: Function;
  setPesan: Function;
  isSukses: Function;
  eprodukId: number;
  enama: string;
  ekategoriId: number;
  ehargaModal: number;
  ehargaJual: number;
  id: number;
}

const Edit = ({
  reload,
  isError,
  setPesan,
  isSukses,
  eprodukId,
  enama,
  ekategoriId,
  ehargaModal,
  ehargaJual,
  id,
}: EditProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(false);
  const [kategoriNama, setKategoriNama] = useState<string>("");

  const [nama, setNama] = useState(enama);
  const [kategoriId, setKategoriId] = useState<string>(ekategoriId.toString());
  const [hargaModal, setHargaModal] = useState(ehargaModal.toString());
  const [hargaJual, setHargaJual] = useState(ehargaJual.toString());
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
    if (!nama) newErrors.nama = "Nama Item harus diisi.";
    if (!kategoriId) newErrors.kategoriId = "Kategori harus dipilih.";
    if (!hargaModal || isNaN(Number(hargaModal)) || Number(hargaModal) <= 0)
      newErrors.hargaModal = "Modal harus diisi dan berupa angka positif.";
    if (!hargaJual || isNaN(Number(hargaJual)) || Number(hargaJual) < 0)
      newErrors.hargaJual = "Harga Jual harus berupa angka positif.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.put(`/api/detailProduk/${id}`, {
        nama: nama || enama,
        kategoriId: kategoriId || ekategoriId.toString(),
        hargaModal: hargaModal || ehargaModal.toString(),
        hargaJual: hargaJual || ehargaJual.toString(),
        produkId: produkId,
      });

      if (res.data.pesan === "sukses") {
        setIsOpen(false);
        reload();
        clearForm();
        isError(false);
        isSukses(true);
        setPesan("Data berhasil diedit.");
      } else {
        isError(true);
        isSukses(false);
        setPesan("Data gagal diedit.");
        setIsOpen(false);
      }
    } catch (error) {
      console.log("error", error);
      isError(true);
      isSukses(false);
      setPesan("Gagal terhubung ke server.");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setNama("");
    setHargaModal("");
    setHargaJual("");
    setKategoriId("");
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
      <button
        className="text-lg tooltip"
        data-tip="Edit item"
        onClick={handleModal}
      >
        <TbEdit />
      </button>
      <dialog id="my_modal_1" className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-5">Edit Item!</h3>
          <form onSubmit={handleEdit}>
            <div className="mb-3">
              <label className="label">Nama Item</label>
              <input
                type="text"
                placeholder="Nama Item"
                className="input input-bordered w-full"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
              {errors.nama && <p className="text-red-500">{errors.nama}</p>}
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
                <p className="text-red-500">{errors.kategoriId}</p>
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
                <p className="text-red-500">{errors.hargaModal}</p>
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
                <p className="text-red-500">{errors.hargaJual}</p>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" type="button" onClick={handleModal}>
                Tutup
              </button>
              <button className="btn btn-warning text-white" type="submit">
                {loading ? <LoadingButton /> : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Edit;
