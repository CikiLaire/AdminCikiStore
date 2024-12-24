import LoadingButton from "@/app/components/loadingButton";
import axios from "axios";
import React, { useState } from "react";

interface TambahProps {
  reload: Function;
  isError: Function;
  setPesan: Function;
  isSukses: Function;
}

const Tambah = ({ reload, isError, setPesan, isSukses }: TambahProps) => {
  const [nama, setNama] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi input kosong
    if (!nama.trim()) {
      setErrorMsg("Nama produk tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setErrorMsg(""); // Reset pesan kesalahan
    try {
      const formData = new FormData();
      formData.append("nama", nama);

      const res = await axios.post("/api/produk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.pesan === "sukses") {
        setIsOpen(false);
        setNama("");
        reload();
        isSukses(true);
        setPesan("Data berhasil disimpan.");
        isError(false);
      } else {
        isError(true);
        isSukses(false);
        setPesan("Data gagal disimpan.");
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

  const handleModal = () => {
    setIsOpen(!isOpen);
    setErrorMsg(""); // Reset pesan kesalahan saat modal dibuka/tutup
  };

  return (
    <div>
      <button className="btn btn-neutral" onClick={handleModal}>
        Tambah
      </button>
      <dialog id="my_modal_1" className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Tambah Produk!</h3>
          <form onSubmit={handleTambah}>
            <label className="label">Nama Produk</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nama Produk"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            {/* Menampilkan pesan kesalahan */}
            {errorMsg && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
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
