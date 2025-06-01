import { useEffect, useState, useRef } from "react";
import axios from "axios";
import JadwalTableDesktop from "../../components/JadwalTableDesktop";
import JadwalTableMobile from "../../components/JadwalTableMobile";
import searchIcon from "../../assets/icon/cari.png"; // Import search icon
import "../../style/Jadwal.css"; // Import CSS file for styling

export default function Jadwal({ apiURL }) {
  const { _id: id_guru } = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};

  const [ekstrakurikuler, setEkstrakurikuler] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showError, setShowError] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/ekstrakurikuler/guru/${id_guru}` // Ganti dengan ID guru yang sesuai
      );
      setEkstrakurikuler(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();

    // Hapus pencarian sebelumnya agar tidak terlalu cepat
    if (searchTimeout) clearTimeout(searchTimeout);

    if (value === "") {
      setSearchActive(false);
      fetchData(); // Ambil semua data jika input kosong
    } else {
      setSearchActive(true);
      // Tunggu 500ms sebelum menjalankan pencarian
      setSearchTimeout(
        setTimeout(() => {
          handleSearch(value);
        }, 1000)
      );
    }
  };

  const handleSearch = async (searchValue) => {
    const val = searchValue || inputRef;
    try {
      const response = await axios.get(
        `${apiURL}/api/ekstrakurikuler/guru/search/${id_guru}/${val}`
      );
      setEkstrakurikuler(response.data);
    } catch (err) {
      setShowError(true);
      setEkstrakurikuler([]);
    }
  };
  const inputRef = useRef(null);

  return (
    <div>
      <h2 className="title">Jadwal Kegiatan</h2>
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
          onClick={handleSearch} // Tambahkan fungsi pencarian jika diperlukan
        >
          Cari
        </button>
      </div>
      <div className="jadwal-table-desktop">
        <JadwalTableDesktop data={ekstrakurikuler} />
      </div>
      <div className="jadwal-table-mobile-wrapper">
        <JadwalTableMobile data={ekstrakurikuler} />
      </div>
      {showError && <div className="toast-error">Data Tidak Ditemukan</div>}
    </div>
  );
}
