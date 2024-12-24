import LoadingButton from "@/app/components/loadingButton";
import axios from "axios";
import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";

interface HapusProps {
  reload: Function;
  isError: Function;
  setPesan: Function;
  isSukses: Function;
  id: number;
}

const Hapus = ({ reload, isError, setPesan, isSukses, id }: HapusProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHapus = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`/api/detailProduk/${id}`);

      if (res.data.pesan === "sukses") {
        setIsOpen(false);
        reload();
        isSukses(true);
        setPesan("Data berhasil dihapus.");
        isError(false);
      } else {
        isError(true);
        isSukses(false);
        setPesan("Data gagal dihapus.");
        setIsOpen(false);
      }
    } catch (error) {
      console.log("error", error);
      isError(true);
      isSukses(false);
      setPesan("Data gagal dihapus.");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <button
        className="text-lg tooltip"
        data-tip="Hapus produk"
        onClick={handleModal}
      >
        <MdOutlineDelete />
      </button>
      <dialog id="my_modal_1" className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hapus Item!</h3>
          <p className="py-4 text-base">
            Apakah anda yakin ingin menghapus item ini?
          </p>
          <div className="modal-action">
            <button className="btn" onClick={handleModal}>
              Tutup
            </button>
            <button className="btn btn-error text-white" onClick={handleHapus}>
              {loading ? <LoadingButton /> : "Hapus"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Hapus;
