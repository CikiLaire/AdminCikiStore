import LoadingButton from "@/app/components/loadingButton";
import axios from "axios";
import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";

interface TambahProps {
  reload: Function;
  isError: Function;
  setPesan: Function;
  isSukses: Function;
  id: number;
  nama: string;
}

const Edit = ({
  reload,
  isError,
  setPesan,
  isSukses,
  id,
  nama,
}: TambahProps) => {
  const [enama, setNama] = useState(nama);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!enama.trim()) {
      setErrorMsg("Nama produk tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.put(`/api/produk/${id}`, {
        nama: enama,
      });

      if (res.data.pesan === "sukses") {
        setIsOpen(false);
        setNama("");
        reload();
        isSukses(true);
        setPesan("Data berhasil diedit.");
        isError(false);
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

  const handleModal = () => {
    setIsOpen(!isOpen);
    setErrorMsg("");
  };

  return (
    <div>
      <button
        className="text-lg tooltip"
        data-tip="Edit produk"
        onClick={handleModal}
      >
        <TbEdit />
      </button>
      <dialog id="my_modal_1" className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Edit Produk!</h3>
          <form onSubmit={handleEdit}>
            <label className="label">Nama Produk</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nama Produk"
              value={enama}
              onChange={(e) => setNama(e.target.value)}
            />
            {errorMsg && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
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
