import scanIcon from "../../assets/icon/scan.png";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import searchIcon from "../../assets/icon/cari.png";
import excelIcon from "../../assets/icon/excel.png";
import "../../style/ekstrakurikuler.css";
import EkstrakurikulerDaftarSiswaTable from "../../components/EkstrakurikulerDaftarSiswaTable";
import EkstrakurikulerDaftarSiswaTableMobile from "../../components/EkstrakurikulerDaftarSiswaTableMobile";
import axios from "axios";

const DATA_PER_PAGE = 5;

export default function EkstrakurikulerDaftarSiswa({ apiURL }) {
  const { idEkstrakurikuler } = useParams();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [page, setPage] = useState(1);
  const [siswa, setSiswa] = useState([]);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showSuccessDelete, setShowSuccessDelete] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/siswa/daftar/ekstrakurikuler/${idEkstrakurikuler}`
      );
      setSiswa(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
    }

    if (location.state?.error) {
      setShowError(true);
    }
  }, [location.state]);

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

  const handleConfirmDelete = async () => {
    // Tampilkan notifikasi sukses jika perlu

    try {
      await axios.delete(
        `${apiURL}/api/siswa/ekstrakurikuler/${deleteId}/${idEkstrakurikuler}`
      );
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

    setShowToast(false);
    setDeleteId(null);
    // Tampilkan notifikasi sukses jika perlu
  };

  const handleCancelDelete = () => {
    setShowToast(false);
    setDeleteId(null);
  };

  const handleBlur = () => {
    setSearchActive(false);
  };

  const handleDeleteSiswa = (id) => {
    // Implementasi hapus data siswa di sini
    setDeleteId(id);
    setShowToast(true);
  };

  // Pagination logic
  const totalPage = Math.ceil(siswa.length / DATA_PER_PAGE);
  const startIdx = (page - 1) * DATA_PER_PAGE;
  const currentData = siswa.slice(startIdx, startIdx + DATA_PER_PAGE);

  return (
    <div>
      <h2 className="ekstrakurikuler-title title">
        Daftar Siswa Ekstrakurikuler
      </h2>
      <div className="daftar-siswa-flex-container">
        <div className="btn-container">
          <button
            className="btn-add-daftar-siswa"
            onClick={() =>
              navigate(`/ekstrakurikuler/tambah/siswa/${idEkstrakurikuler}`)
            }
          >
            <img src={scanIcon} alt="Tambah" /> Tambah Siswa
          </button>
          <button
            className="btn-add-scan-siswa"
            onClick={() =>
              navigate(`/ekstrakurikuler/siswa/scan/${idEkstrakurikuler}`)
            }
          >
            <img src={scanIcon} alt="Scan" /> Scan Siswa
          </button>
        </div>
        <div className="search-input-container">
          <span className="search-icon-inside">
            <img src={searchIcon} alt="Cari" />
          </span>
          <input
            ref={inputRef}
            className="search-input-daftar-siswa"
            type="text"
            placeholder="Cari siswa..."
            onBlur={handleBlur}
          />
          <button
            className="btn-search-action"
            type="button"
            style={{ marginLeft: 8 }}
          >
            Cari
          </button>
        </div>
      </div>
      <EkstrakurikulerDaftarSiswaTable
        data={currentData}
        onDelete={handleDeleteSiswa}
      />
      <EkstrakurikulerDaftarSiswaTableMobile
        data={currentData}
        onDelete={handleDeleteSiswa}
      />
      <div className="ekstrakurikuler-table-footer-container">
        <div className="ekstrakurikuler-pagination-nav">
          <button
            className="ekstrakurikuler-btn-page"
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              className={`ekstrakurikuler-btn-page${
                page === i + 1 ? " active" : ""
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="ekstrakurikuler-btn-page"
            onClick={() => setPage(page < totalPage ? page + 1 : totalPage)}
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
        <button className="btn-export">
          <img src={excelIcon} alt="export" />
          Export Excel
        </button>
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
      {showError && <div className="toast-error">{location.state.error}</div>}
      {showSuccessDelete && (
        <div className="toast-success">Data Berhasil Dihapus</div>
      )}
    </div>
  );
}
