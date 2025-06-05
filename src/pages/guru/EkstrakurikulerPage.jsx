import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import addIcon from "../../assets/icon/add.png";
import searchIcon from "../../assets/icon/cari.png";
import "../../style/ekstrakurikuler.css";
import TableEkstrakurikuler from "../../components/TableEkstrakurikuler.jsx";
import TableEkstrakurikulerMobile from "../../components/TableEkstrakurikulerMobile.jsx";
import axios from "axios";

const DATA_PER_PAGE = 5;

export default function EkstrakurikulerPage({ apiURL }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSuccess, setShowSuccess] = useState(!!location.state?.success);
  const [ekstrakurikuler, setEkstrakurikuler] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showError, setShowError] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const { _id: id_guru } = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};

  const fetchData = async () => {
    try {
      if (localStorage.getItem("userRole") == "admin") {
        const response = await axios.get(
          `${apiURL}/api/admin/ekstrakurikuler` // Ganti dengan ID guru yang sesuai
        );
        setEkstrakurikuler(response.data);
      } else {
        const response = await axios.get(
          `${apiURL}/api/ekstrakurikuler/guru/${id_guru}` // Ganti dengan ID guru yang sesuai
        );
        setEkstrakurikuler(response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }

    if (showError) {
      const timer = setTimeout(() => setShowError(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, showError]);

  // pagination
  const [page, setPage] = useState(1);
  const DATA_PER_PAGE = 5;
  const totalPage = Math.ceil(ekstrakurikuler.length / DATA_PER_PAGE);

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
  const handleBlur = () => {
    setSearchActive(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) setPage(newPage);
  };
  const handleEdit = (id) => {
    navigate(`/ekstrakurikuler/ubah/${id}`);
  };
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowToast(true);
  };
  const handleExportExcel = () => {
    /* ... */
  };
  const handleDetail = (id) => {
    navigate(`detail/${id}`);
  };

  // toast

  const handleConfirmDelete = async () => {
    setShowToast(false);
    setDeleteId(null);
    // Tampilkan notifikasi sukses jika perlu

    try {
      await axios.delete(`${apiURL}/api/ekstrakurikuler/${deleteId}`);
      setDeleteId(null);
      setShowSuccessDelete(true);
      // Panggil ulang fetchData untuk memperbarui daftar siswa
      fetchData();

      // Aktifkan toast sukses

      // Toast otomatis hilang setelah 2 detik
      setTimeout(() => setShowSuccessDelete(false), 2000);
    } catch (err) {
      console.error("Error when deleting data:", err);
    }
  };

  const handleCancelDelete = () => {
    setShowToast(false);
    setDeleteId(null);
  };

  return (
    <div>
      <h2 className="ekstrakurikuler-title title">Ekstrakurikuler</h2>
      <div className="ekstrakurikuler-flex-container">
        <div className="ekstrakurikuler-flex-child">
          <button
            className="ekstrakurikuler-btn-add"
            onClick={() => navigate("/ekstrakurikuler/tambah")}
          >
            <img src={addIcon} alt="Tambah" /> Tambah Ekstrakurikuler
          </button>
        </div>
        <div className="ekstrakurikuler-flex-child">
          <div className="ekstrakurikuler-search-input-container">
            <span className="ekstrakurikuler-search-icon-inside">
              <img src={searchIcon} alt="Cari" />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Cari Ekstrakurikuler..."
              className={`search-input${searchActive ? " active" : ""}`}
              onBlur={handleBlur}
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
        </div>
      </div>
      <div className="ekstrakurikuler-table-responsive">
        <div className="ekstrakurikuler-table-desktop">
          <TableEkstrakurikuler
            data={ekstrakurikuler}
            page={page}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExportExcel}
          />
        </div>
        <div className="ekstrakurikuler-table-mobile">
          <TableEkstrakurikulerMobile
            data={ekstrakurikuler}
            page={page}
            setPage={setPage}
            onDetail={handleDetail}
            onExport={handleExportExcel}
          />
        </div>
      </div>
      {showToast && (
        <div className="toast-confirm">
          <div className="toast-content">
            <p>Yakin ingin menghapus data ini?</p>
            <div className="toast-actions">
              <button
                className="btn-toast btn-danger"
                onClick={handleConfirmDelete}
              >
                Hapus
              </button>
              <button className="btn-toast" onClick={handleCancelDelete}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="toast-success">{location.state.success}</div>
      )}
      {showSuccessDelete && (
        <div className="toast-success">Data Berhasil Dihapus</div>
      )}
      {showError && <div className="toast-error">Data Tidak Ditemukan</div>}
    </div>
  );
}
