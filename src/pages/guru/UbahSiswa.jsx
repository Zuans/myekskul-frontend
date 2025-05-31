import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/tambahSiswa.css";
import axios from "axios";

export default function UbahSiswa() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Cari data siswa yang akan diubah berdasarkan id dari URL

  const [siswa, setSiswa] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7878/api/siswa/id/${id}`
        );
        setSiswa(response.data);
      } catch (err) {
        setError("Data siswa tidak ditemukan.", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading data...</p>;

  // Jika terjadi error atau data kosong, tampilkan pesan error
  if (error || !siswa)
    return (
      <p style={{ color: "red" }}>{error || "Data siswa tidak ditemukan."}</p>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:7878/api/siswa/${id}`, {
        nama: siswa.nama,
        kelas: siswa.kelas,
      });
      navigate("/siswa", { state: { success: "Data siswa berhasil diubah!" } });
    } catch (err) {
      console.error("Error updating data:", err);
    }
  };

  return (
    <div>
      <h2 className="title">Ubah Siswa</h2>
      <form className="form-tambah-siswa" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            type="text"
            value={siswa.nama}
            onChange={(e) => setSiswa({ ...siswa, nama: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="kelas">Kelas</label>
          <input
            id="kelas"
            type="text"
            value={siswa.kelas}
            onChange={(e) => setSiswa({ ...siswa, kelas: e.target.value })}
            required
          />
        </div>
        <button className="btn-tambah" type="submit">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
