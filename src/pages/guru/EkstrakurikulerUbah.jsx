import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../style/tambahEkstrakurikuler.css";
import axios from "axios";

export default function EkstrakurikulerUbah({ apiURL }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nama, setNama] = useState("");
  const [hari, setHari] = useState("");
  const [jam, setJam] = useState("");
  const [menit, setMenit] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/api/ekstrakurikuler/id/${id}`
        );
        const { nama, jam, hari } = await response.data;
        setNama(nama);
        setHari(hari);
        setJam(jam.split(":")[0]); // Ambil jam dari format HH:MM
        setMenit(jam.split(":")[1]); // Ambil menit dari format HH:MM
      } catch (err) {
        setError("Data siswa tidak ditemukan.", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const waktu = `${jam.padStart(2, "0")}:${menit.padStart(2, "0")}`;

    try {
      await axios.put(`${apiURL}/api/ekstrakurikuler/${id}`, {
        nama,
        hari,
        jam: waktu,
      });
    } catch (err) {
      console.error("Error updating data:", err);
    }
    // Proses update data di sini
    navigate("/ekstrakurikuler", {
      state: { success: "Data ekstrakurikuler berhasil diubah!" },
    });
  };

  return (
    <div>
      <h2 className="tambah-ekstrakurikuler-title title">
        Ubah Ekstrakurikuler
      </h2>
      <form className="tambah-ekstrakurikuler-form" onSubmit={handleSubmit}>
        <div className="tambah-ekstrakurikuler-form-group">
          <label htmlFor="nama">Nama Kegiatan</label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Masukkan nama ekstrakurikuler"
          />
        </div>
        <div className="tambah-ekstrakurikuler-form-row">
          <div className="tambah-ekstrakurikuler-form-group">
            <label htmlFor="hari">Hari</label>
            <input
              id="hari"
              type="text"
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              required
              placeholder="Masukkan hari"
            />
          </div>
          <div className="tambah-ekstrakurikuler-form-group">
            <label htmlFor="jam">Jam</label>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                id="jam"
                type="number"
                min="0"
                max="23"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                required
                placeholder="Jam"
                style={{ width: "50px" }}
                className="jam-input"
              />
              <span>:</span>
              <input
                id="menit"
                type="number"
                min="0"
                max="59"
                value={menit}
                onChange={(e) => setMenit(e.target.value)}
                required
                placeholder="Menit"
                style={{ width: "50px" }}
                className="menit-input"
              />
            </div>
          </div>
        </div>
        <button className="ubah-ekstrakurikuler-btn" type="submit">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
