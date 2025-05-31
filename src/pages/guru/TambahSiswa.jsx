import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/tambahSiswa.css";
import axios from "axios";

export default function TambahSiswa() {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = async () => {
      try {
        const response = await axios.post("http://localhost:7878/api/siswa", {
          nama,
          kelas,
        });
        console.log("Data berhasil dikirim:", response.data);
        navigate("/siswa", {
          state: { success: "Data siswa berhasil ditambahkan!" },
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Gagal menambahkan siswa!";
        console.log(errorMessage);
        navigate(`/siswa`, {
          state: { error: errorMessage },
        });
      }
    };

    postData();
  };
  return (
    <div>
      <h2 className="title">Tambah Siswa</h2>
      <form className="form-tambah-siswa" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Masukkan nama siswa"
          />
        </div>
        <div className="form-group">
          <label htmlFor="kelas">Kelas</label>
          <input
            id="kelas"
            type="text"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            required
            placeholder="Masukkan kelas"
          />
        </div>
        <button className="btn-tambah" type="submit">
          Tambahkan
        </button>
      </form>

      {/* Form Upload Siswa */}
    </div>
  );
}
