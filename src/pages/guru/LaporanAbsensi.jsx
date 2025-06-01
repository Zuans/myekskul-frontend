import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icon/cari.png";
import "../../style/laporanAbsensi.css";
import axios from "axios";
import LaporanAbsensiTableDesktop from "../../components/LaporanAbsensiTableDesktop";

const PAGE_SIZE = 5;

let { _id: id_guru } = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : {};

export default function LaporanAbsensi({ apiURL }) {
  const navigate = useNavigate();
  const [ekstrakurikuler, setEkstrakurikuler] = useState([]);
  const [dataGuru, setDataGuru] = useState();
  const [showError, setShowError] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/ekstrakurikuler/guru/${id_guru}` // Ganti dengan ID guru yang sesuai
      );
      setDataGuru(JSON.parse(localStorage.getItem("dataGuru")));
      console.log(dataGuru);
      setEkstrakurikuler(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [page, setPage] = useState(1);
  const inputRef = useRef(null);
  const totalPage = Math.ceil(ekstrakurikuler.length / PAGE_SIZE);
  const pagedData = ekstrakurikuler.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showError]);

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

  return (
    <div>
      <h2 className="title">Laporan Absensi</h2>
      <div className="laporan-search-input-container">
        <span className="laporan-search-icon-inside">
          <img src={searchIcon} alt="Cari" />
        </span>
        <input
          className="laporan-search-input"
          type="text"
          placeholder="Cari Ekstrakurikuler"
          onChange={handleSearchChange}
        />
        <button
          className="laporan-btn-search-action"
          type="button"
          style={{ marginLeft: 8 }}
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>
      <LaporanAbsensiTableDesktop
        data={pagedData}
        onDetail={(id, kegiatan) =>
          navigate(`/laporanAbsensi/${kegiatan}/${id}`)
        }
        page={page}
        totalPage={totalPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
