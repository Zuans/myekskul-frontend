import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

import doneIcon from "../../assets/icon/done.png";
import deleteIcon from "../../assets/icon/delete.png";
import editIcon from "../../assets/icon/edit.png";

import "../../style/guruPage.css";

export default function GuruPage({ apiURL }) {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState();
  const [showError, setShowError] = useState();
  const [showToast, setShowToast] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [guru, setGuru] = useState([]);
  const [showNotFound, setShowNotFound] = useState(false);
  const [requestGuruPage, setRequestGuruPage] = useState(1);
  const [guruPage, setGuruPage] = useState(1);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);

  const reqData = [
    { nama: "Budi Santoso" },
    { nama: "Ani Wijaya" },
    { nama: "Siti Rahma" },
    { nama: "Joko Sembiring" },
    { nama: "Dewi Lestari" },
  ];

  const dataGuru = [
    { nama: "Budi Santoso" },
    { nama: "Ani Wijaya" },
    { nama: "Siti Rahma" },
    { nama: "Joko Sembiring" },
    { nama: "Dewi Lestari" },
    { nama: "Joko Sembiring" },
    { nama: "Dewi Lestari" },
  ];

  const fetchDataGuru = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/guru`);
      setGuru(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchDataGuru();
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

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
    }

    if (location.state?.error) {
      setShowError(true);
    }
  }, [location.state]);

  const DATA_PER_PAGE = 5;
  const maxPagesToShow = 4;

  const requestGuruTotalPage = Math.ceil(reqData.length / DATA_PER_PAGE);
  const requestGuruStartIdx = (requestGuruPage - 1) * DATA_PER_PAGE;
  const requestGuruCurrentData = reqData.slice(
    requestGuruStartIdx,
    requestGuruStartIdx + DATA_PER_PAGE
  );

  const requestGuruStartPage = Math.max(
    1,
    requestGuruPage - Math.floor(maxPagesToShow / 2)
  );
  const requestGuruEndPage = Math.min(
    requestGuruTotalPage,
    requestGuruStartPage + maxPagesToShow - 1
  );

  const guruTotalPage = Math.ceil(guru.length / DATA_PER_PAGE);
  const guruStartIdx = (guruPage - 1) * DATA_PER_PAGE;
  const guruCurrentData = dataGuru.slice(
    guruStartIdx,
    guruStartIdx + DATA_PER_PAGE
  );

  const guruStartPage = Math.max(1, guruPage - Math.floor(maxPagesToShow / 2));
  const guruEndPage = Math.min(
    guruTotalPage,
    guruStartPage + maxPagesToShow - 1
  );

  const handleSearch = () => {
    const searchGuru = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/api/guru/search/${inputRef.current.value}`
        );
        setGuruPage(1);
        setGuru(response.data);
      } catch (err) {
        setShowNotFound(err);
        setGuru([]);
      }
    };
    searchGuru();
  };

  const handleDeleteClick = (id) => {
    setShowToast(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    setShowToast(false);

    try {
      const response = await axios.delete(`${apiURL}/api/guru/${deleteId}`);
      console.log(response.data);
      setDeleteId(null);
      setShowSuccessDelete(true);

      // Aktifkan toast sukses

      // Toast otomatis hilang setelah 2 detik
      setTimeout(() => setShowSuccessDelete(false), 2000);
      fetchDataGuru();
    } catch (err) {
      console.error("Error when deleting data:", err);
    }
  };

  const handleCancelDelete = () => {
    setShowToast(false);
    setDeleteId(null);
  };

  return (
    <>
      <h2 className="title">Guru</h2>
      <h3 className="title-table">Request Akun Guru</h3>
      <div className="table-container table-request">
        <table className="siswa-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requestGuruCurrentData.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Tidak ada data
                </td>
              </tr>
            )}
            {requestGuruCurrentData.map((guru, idx) => (
              <tr key={requestGuruStartIdx + idx}>
                <td>{requestGuruStartIdx + idx + 1}</td>
                <td>{guru.nama}</td>
                <td>
                  <button className="btn-approve">
                    <img src={doneIcon} alt="done-button" />
                  </button>
                  <button className="btn-reject">
                    <img
                      src={deleteIcon}
                      onClick={() => handleDeleteClick(guru._id)}
                      alt="reject-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-container table-footer">
        <div className="flex-child pagination-nav pagination-req-guru table-request">
          <button
            className="btn-page"
            onClick={() =>
              setRequestGuruPage(requestGuruPage > 1 ? requestGuruPage - 1 : 1)
            }
            disabled={requestGuruPage === 1}
          >
            {"<"}
          </button>
          {[...Array(requestGuruEndPage - requestGuruStartPage + 1)].map(
            (_, i) => (
              <button
                key={i}
                className={`btn-page${
                  requestGuruPage === requestGuruStartPage + i ? " active" : ""
                }`}
                onClick={() => setRequestGuruPage(requestGuruStartPage + i)}
              >
                {requestGuruStartPage + i}
              </button>
            )
          )}
          <button
            className="btn-page"
            onClick={() =>
              setRequestGuruPage(
                requestGuruPage < requestGuruTotalPage
                  ? requestGuruPage + 1
                  : requestGuruTotalPage
              )
            }
            disabled={requestGuruPage === requestGuruTotalPage}
          >
            {">"}
          </button>
        </div>
      </div>
      <h3 className="title-table">Semua Akun Guru</h3>
      <div className="search-container">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Cari Guru..."
        />
        <button
          className="btn-search-action"
          type="button"
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>
      <div className="table-container table-guru table-request">
        <table className="siswa-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guru.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Tidak ada data guru
                </td>
              </tr>
            )}
            {guru.map((guru, idx) => (
              <tr key={guruStartIdx + idx}>
                <td>{guruStartIdx + idx + 1}</td>
                <td>{guru.nama}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/guru/ubah/${guru._id}`)}
                  >
                    <img src={editIcon} alt="done-button" />
                  </button>
                  <button className="btn-reject">
                    <img
                      src={deleteIcon}
                      onClick={() => handleDeleteClick(guru._id)}
                      alt="reject-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-container table-footer">
        <div className="flex-child pagination-nav pagination-guru">
          <button
            className="btn-page"
            onClick={() => setGuruPage(guruPage > 1 ? guruPage - 1 : 1)}
            disabled={guruPage === 1}
          >
            {"<"}
          </button>
          {[...Array(guruEndPage - guruStartPage + 1)].map((_, i) => (
            <button
              key={i}
              className={`btn-page${
                guruPage === guruStartPage + i ? " active" : ""
              }`}
              onClick={() => setGuruPage(guruStartPage + i)}
            >
              {guruStartPage + i}
            </button>
          ))}
          <button
            className="btn-page"
            onClick={() =>
              setGuruPage(
                guruPage < guruTotalPage ? guruPage + 1 : guruTotalPage
              )
            }
            disabled={guruPage === guruTotalPage}
          >
            {">"}
          </button>
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
        <div className="toast-success">{location.state?.success}</div>
      )}
      {showError && <div className="toast-error">{location.state?.error}</div>}
      {showSuccessDelete && (
        <div className="toast-success">Data Berhasil Dihapus</div>
      )}{" "}
    </>
  );
}
