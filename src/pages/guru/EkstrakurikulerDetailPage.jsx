import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import editIcon from "../../assets/icon/edit.png";
import deleteIcon from "../../assets/icon/delete.png";
import "../../style/detailEkstrakurikuler.css";
import userIcon from "../../assets/icon/user.png";
import axios from "axios";

export default function EkstrakurikulerDetailMobile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  const [ekstrakurikuler, setEkstrakurikuler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleDelete = (id) => {
    setShowToast(true);
  };

  const handleCancelDelete = () => {
    setShowToast(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7878/api/ekstrakurikuler/id/${id}`
        );
        setEkstrakurikuler(response.data);
      } catch (err) {
        setError("Data siswa tidak ditemukan.", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleDaftarSiswa = () => {
    navigate(`/ekstrakurikuler/siswa/${id}`);
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:7878/api/ekstrakurikuler/${id}`);

      // Aktifkan toast sukses

      // Toast otomatis hilang setelah 2 detik
      navigate("/ekstrakurikuler", {
        state: { success: "Data ekstrakurikuler berhasil dihapus!" },
      });
    } catch (err) {
      console.error("Error when deleting data:", err);
    }
  };

  if (loading) return <p>Loading data...</p>;

  // Jika terjadi error atau data kosong, tampilkan pesan error
  if (error || !ekstrakurikuler)
    return (
      <p style={{ color: "red" }}>
        {error || "Data ekstrakurikuler tidak ditemukan."}
      </p>
    );

  return (
    <div className="detail-ekstrakurikuler">
      <h2 className="title">Detail Ekstrakurikuler</h2>
      <table className="data-ekstrakurikuler-table">
        <thead>
          <tr>
            <th>Nama Kegiatan</th>
            <th>Hari</th>
            <th>Jam</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ekstrakurikuler.nama}</td>
            <td>{ekstrakurikuler.hari}</td>
            <td>{ekstrakurikuler.jam}</td>
          </tr>
        </tbody>
      </table>
      <div className="detail-actions">
        <button
          className="btn-detail-action daftar"
          onClick={handleDaftarSiswa}
        >
          <img src={userIcon} alt="Hapus" /> Daftar Siswa
        </button>
        <button
          className="btn-detail-action edit"
          onClick={() => navigate(`/ekstrakurikuler/ubah/${id}`)}
        >
          <img src={editIcon} alt="Ubah" /> Ubah
        </button>
        <button className="btn-detail-action delete" onClick={handleDelete}>
          <img src={deleteIcon} alt="Hapus" /> Hapus
        </button>
      </div>
      {showToast && (
        <div className="toast-confirm">
          <div className="toast-content">
            <p>Yakin ingin menghapus data ini?</p>
            <div className="toast-actions">
              <button
                className="btn-toast btn-danger"
                onClick={handleDeleteClick}
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
    </div>
  );
}
