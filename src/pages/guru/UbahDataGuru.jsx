import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/tambahSiswa.css"; // Impor CSS tetap dipertahankan
import axios from "axios";

export default function UbahDataGuru({ apiURL }) {
  const navigate = useNavigate();

  // State untuk menyimpan data guru yang akan diubah
  const [guru, setGuru] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/guru/${id}`);
        setGuru(response.data);
      } catch (err) {
        setError("Data guru tidak ditemukan.", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading data...</p>;
  if (error || !guru)
    return (
      <p style={{ color: "red" }}>{error || "Data guru tidak ditemukan."}</p>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiURL}/api/guru/${id}`, {
        nama: guru.nama,
        username: guru.username,
        password: guru.password, // Pastikan password dienkripsi saat dikirim ke server
      });
      const isAdmin = localStorage.getItem("userRole") === "admin";
      if (isAdmin) {
        navigate("/guru", { state: { success: "Data guru berhasil diubah!" } });
      } else {
        const userData = JSON.parse(localStorage.getItem("userData"));
        userData.username = guru.username;
        userData.nama = guru.nama;
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/", { state: { success: "Data guru berhasil diubah!" } });
      }
    } catch (err) {
      console.error("Error updating data:", err);
    }
  };

  return (
    <div>
      <h2 className="title">Ubah Guru</h2>
      <form className="form-tambah-siswa" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nama">Nama Guru</label>
          <input
            id="nama"
            type="text"
            value={guru.nama}
            onChange={(e) => setGuru({ ...guru, nama: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={guru.username}
            onChange={(e) => setGuru({ ...guru, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={guru.password}
            onChange={(e) => setGuru({ ...guru, password: e.target.value })}
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
