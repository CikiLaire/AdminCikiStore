"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { formatRupiah, formatTanggal } from "@/lib/func";
import LoadingButton from "@/app/components/loadingButton";
import { useRouter } from "next/navigation";

interface Cicilan {
  id: number;
  jumlah: number;
  hutangId: number;
  tanggal: string;
}

interface Hutang {
  id: number;
  nama: string;
  hutang: number;
  tanggal: string;
  sisa: number;
  Cicilan: Cicilan[];
}

const DetailHutangPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<Hutang | null>(null);
  const [cicilan, setCicilan] = useState<Cicilan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pesan, setPesan] = useState("");
  const [isSukses, setIsSukses] = useState(false);
  const router = useRouter();

  const [jumlah, setJumlah] = useState("0");
  const [tanggal, setTanggal] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadData();
    loadCicilan();
  }, []);

  useEffect(() => {
    if (isError || isSukses) {
      const timer = setTimeout(() => {
        setIsError(false);
        setIsSukses(false);
        setPesan("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isError, isSukses]);

  useEffect(() => {
    if (data?.sisa === 0) {
      router.push("/laporan");
    }
  }, [data, router]);

  const loadData = async () => {
    try {
      const res = await axios.get(`/api/detailHutang/${id}`);
      const data = res.data;
      setData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleBayar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const sisa = Number(data?.sisa) - Number(jumlah);
      const formatISOTanggal = new Date(tanggal).toISOString();
      formData.append("hutangId", id.toString());
      formData.append("jumlah", jumlah);
      formData.append("tanggal", formatISOTanggal);
      formData.append("sisa", sisa.toString());

      const res = await axios.post(`/api/detailHutang/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.pesan === "sukses") {
        if (res.data.redirect) {
          router.push(res.data.redirect);
        } else {
          loadCicilan();
          loadData();
          setIsSukses(true);
          setPesan("Cicilan berhasil ditambahkan.");
          setIsError(false);
          setJumlah("0");
          setTanggal("");
        }
      } else {
        setIsError(true);
        setPesan("Gagal menambahkan data.");
      }
    } catch (error) {
      console.log("error", error);
      setIsError(true);
      setPesan("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const loadCicilan = async () => {
    try {
      const res = await axios.get(`/api/detailHutang`);
      const data = res.data;
      setCicilan(data);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="border border-slate-700/30 p-5 rounded-md">
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
      <h1 className="py-3 text-xl text-white">Detail Hutang</h1>
      <div className="mb-5">
        <h1>Nama Pelanggan : {data?.nama}</h1>
        <h1>Hutang : {formatRupiah(data?.hutang ?? 0)}</h1>
        <h1>Sisa Hutang : {formatRupiah(data?.sisa ?? 0)}</h1>
      </div>
      <div className="w-full">
        <h1 className="text-xl text-white">Tambah Cicilan</h1>
        <form className="mb-5" onSubmit={handleBayar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Jumlah cicilan</label>
              <label className="input input-bordered flex items-center gap-2">
                Rp
                <input
                  type="text"
                  className="grow"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="Jumlah Cicilan"
                />
              </label>
            </div>
            <div>
              <label className="label">Tanggal</label>
              <div className="flex gap-5 w-full">
                <input
                  type="date"
                  className="input input-bordered w-full"
                  placeholder="Jumlah Cicilan"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  {loading ? <LoadingButton /> : "Bayar"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="overflow-x-auto">
        <h1 className="text-xl text-white">Daftar Cicilan</h1>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Jumlah Cicilan</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {cicilan.length == 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  Belum ada cicilan.
                </td>
              </tr>
            ) : (
              cicilan.map((item, index) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>{formatRupiah(item.jumlah)}</td>
                  <td>{formatTanggal(item.tanggal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailHutangPage;
