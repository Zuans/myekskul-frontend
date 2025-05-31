import { useEffect, useState, useRef } from "react";
import axios from "axios";
import JadwalTableDesktop from "../../components/JadwalTableDesktop";
import JadwalTableMobile from "../../components/JadwalTableMobile";
import searchIcon from "../../assets/icon/cari.png";
import "../../style/Jadwal.css";

export default function JadwalSiswa() {
  const { _id: id_siswa } = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};

  const [jadwalNanti, setJadwalNanti] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showError, setShowError] = useState(false);
  const inputRef = useRef(null);

  const fetchJadwal = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/siswa/jadwal-nanti/${id_siswa}`
      );
      setJadwalNanti(response.data.jadwalNanti);
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();

    if (searchTimeout) clearTimeout(searchTimeout);

    if (value === "") {
      setSearchActive(false);
      fetchJadwal();
    } else {
      setSearchActive(true);
      setSearchTimeout(
        setTimeout(() => {
          handleSearch(value);
        }, 1000)
      );
    }
  };

  const handleSearch = async (searchValue) => {
    const val = searchValue || inputRef.current.value;
    try {
      const response = await axios.get(
        `http://localhost:7878/api/siswa/search/jadwal-nanti/${id_siswa}/${val}`
      );
      console.log(
        `http://localhost:7878/api/siswa/search/jadwal-nanti/${id_siswa}/${val}`
      );
      setJadwalNanti(response.data.jadwalNanti);
    } catch (err) {
      setShowError(true);
      setJadwalNanti([]);
    }
  };

  return (
    <div>
      <h2 className="title">Jadwal Kegiatan Siswa</h2>
      <div className="ekstrakurikuler-search-input-container">
        <span className="ekstrakurikuler-search-icon-inside">
          <img src={searchIcon} alt="Cari" />
        </span>
        <input
          ref={inputRef}
          className="ekstrakurikuler-search-input"
          type="text"
          placeholder="Cari Jadwal"
          onChange={handleSearchChange}
        />
        <button
          className="ekstrakurikuler-btn-search-action"
          type="button"
          style={{ marginLeft: 8 }}
          onClick={() => handleSearch(inputRef.current.value)}
        >
          Cari
        </button>
      </div>

      <ul className="dashboard-siswa-jadwal-nanti-list">
        {jadwalNanti && jadwalNanti.length > 0 ? (
          <table className="dashboard-siswa-jadwal-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Ekstrakurikuler</th>
                <th>Hari</th>
              </tr>
            </thead>
            <tbody>
              {jadwalNanti.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.tanggal}</td>
                  <td>{schedule.namaEkstrakurikuler}</td>
                  <td>{schedule.hari}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="dashboard-siswa-jadwal-empty">
            Tidak ada jadwal tersedia
          </p>
        )}
      </ul>

      {showError && <div className="toast-error">Data Tidak Ditemukan</div>}
    </div>
  );
}
