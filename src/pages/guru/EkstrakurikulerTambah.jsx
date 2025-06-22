import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/tambahEkstrakurikuler.css";
import axios from "axios";

export default function TambahEkstrakurikuler({ apiURL }) {
  const [nama, setNama] = useState("");
  const [hari, setHari] = useState("");
  const [jam, setJam] = useState("");
  const [menit, setMenit] = useState("");
  const navigate = useNavigate();
  const { _id: id_guru } = JSON.parse(localStorage.getItem("userData"));
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const [listGuru, setListGuru] = useState([]);

  const fetchData = async () => {
    try {
      if (isAdmin) {
        const response = await axios.get(`${apiURL}/api/guru`);
        setListGuru(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedGuru, setSelectedGuru] = useState("");
  const [searchGuru, setSearchGuru] = useState("");

  // Filter dinamis berdasarkan input pencarian
  const filteredGuru =
    Array.isArray(listGuru) &&
    listGuru.filter((guru) =>
      guru.nama.toLowerCase().includes(searchGuru.toLowerCase())
    );

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    try {
      if (isAdmin) {
        const response = await axios.post(`${apiURL}/api/ekstrakurikuler`, {
          nama,
          hari,
          jam: `${jam}:${menit}`, // Format waktu menjadi "HH:MM"
          id_guru: selectedGuru,
        });
      } else {
        const response = await axios.post(`${apiURL}/api/ekstrakurikuler`, {
          nama,
          hari,
          jam: `${jam}:${menit}`, // Format waktu menjadi "HH:MM"
          id_guru,
        });
      }

      // Reset input setelah berhasil submit
      setNama("");
      setHari("");
      setJam("");
      setMenit("");

      navigate("/ekstrakurikuler", {
        state: { success: "Ekstrakurikuler berhasil ditambahkan!" },
      });
    } catch (err) {
      console.error("Error menambahkan ekstrakurikuler:", err);
      alert("Gagal menambahkan ekstrakurikuler. Silakan coba lagi.");
    }
  };

  return (
    <div>
      <h2 className="tambah-ekstrakurikuler-title title">
        Tambah Ekstrakurikuler
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
            <select
              id="hari"
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              required
              className="hari-select"
            >
              <option value="" disabled>
                Pilih hari
              </option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
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
        {isAdmin && (
          <>
            <div className="tambah-ekstrakurikuler-form-group">
              <label htmlFor="searchGuru">Cari Guru</label>
              <input
                id="searchGuru"
                type="text"
                placeholder="Ketik nama guru"
                value={searchGuru}
                onChange={(e) => setSearchGuru(e.target.value)}
              />
            </div>

            <div className="tambah-ekstrakurikuler-form-group">
              <label htmlFor="guruSelect">Pilih Guru</label>
              <select
                id="guruSelect"
                value={selectedGuru}
                onChange={(e) => setSelectedGuru(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pilih guru dari daftar
                </option>
                {filteredGuru.map((guru) => (
                  <option key={guru._id} value={guru._id}>
                    {guru.nama} ({guru.username})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <button className="tambah-ekstrakurikuler-btn-tambah" type="submit">
          Tambahkan
        </button>
      </form>
    </div>
  );
}
