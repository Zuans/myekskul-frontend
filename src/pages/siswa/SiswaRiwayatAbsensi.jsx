import { useEffect, useState, useRef } from "react";
import axios from "axios";
import searchIcon from "../../assets/icon/cari.png";
import "../../style/siswaRiwayat.css";

export default function SiswaRiwayatAbsensi() {
  const { _id: id_siswa } = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};

  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showError, setShowError] = useState(false);
  const inputRef = useRef(null);
  const [page, setPage] = useState(1);
  const DATA_PER_PAGE = 6;
  const totalPage = Math.ceil(riwayatAbsensi.length / DATA_PER_PAGE);

  const fetchAbsensi = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/siswa/riwayat-absensi/${id_siswa}`
      );
      setRiwayatAbsensi(response.data.riwayatAbsensi);
    } catch (err) {
      console.error("Error fetching attendance history:", err);
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();

    if (searchTimeout) clearTimeout(searchTimeout);

    if (value === "") {
      fetchAbsensi();
    } else {
      setSearchTimeout(
        setTimeout(() => {
          handleSearch(value);
        }, 1000)
      );
    }
  };

  const handleSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/siswa/search/riwayat-absensi/${id_siswa}/${searchValue}`
      );
      console.log(
        `http://localhost:7878/api/siswa/search/riwayat-absensi/${id_siswa}/${searchValue}`
      );
      setRiwayatAbsensi(response.data.absensiList);
    } catch (err) {
      setShowError(true);
      setRiwayatAbsensi([]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) setPage(newPage);
  };

  return (
    <div>
      <h2 className="title">Riwayat Absensi Siswa</h2>
      <div className="ekstrakurikuler-search-input-container">
        <span className="ekstrakurikuler-search-icon-inside">
          <img src={searchIcon} alt="Cari" />
        </span>
        <input
          ref={inputRef}
          className="ekstrakurikuler-search-input"
          type="text"
          placeholder="Cari Ekstrakurikuler"
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
      {/* Tabel Absensi */}
      {riwayatAbsensi.length > 0 ? (
        <table className="dashboard-siswa-riwayat-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Ekstrakurikuler</th>
              <th>Waktu Scan</th>
            </tr>
          </thead>
          <tbody>
            {riwayatAbsensi
              .slice((page - 1) * DATA_PER_PAGE, page * DATA_PER_PAGE)
              .map((absen, index) => (
                <tr key={index}>
                  <td>{absen.tanggalAbsensi}</td>
                  <td>{absen.namaKegiatan}</td>
                  <td>{absen.waktuScan}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="dashboard-siswa-riwayat-empty">Tidak ada data tersedia</p>
      )}

      {/* Pagination */}
      <div className="riwayat-table-footer-container">
        <div className="riwayat-pagination-nav">
          <button
            className="riwayat-btn-page"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              className={`riwayat-btn-page${page === i + 1 ? " active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="riwayat-btn-page"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
      </div>

      {showError && <div className="toast-error">Data Tidak Ditemukan</div>}
    </div>
  );
}
