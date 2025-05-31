import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import userIcon from "../../assets/icon/user.png";

import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function LaporanAbsensiDetail() {
  const navigate = useNavigate();
  const [ekstrakurikuler, setEkstrakurikuler] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/ekstrakurikuler/id/${id}` // Ganti dengan ID guru yang sesuai
      );
      setEkstrakurikuler(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onPertemuan = () => {
    // Handle absensi logic here
    console.log("Absensi button clicked");

    navigate(`/laporanAbsensi/pertemuan/${ekstrakurikuler.nama}/${id}`);
  };
  return (
    <div>
      <h2 className="title">
        {" "}
        Detail Laporan Absensi{" "}
        {ekstrakurikuler.nama ? `- ${ekstrakurikuler.nama}` : ""}{" "}
      </h2>
      <table className="absensi-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kegiatan</td>
            <td>{ekstrakurikuler.nama}</td>
          </tr>
          <tr>
            <td>Hari</td>
            <td>{ekstrakurikuler.hari}</td>
          </tr>
          <tr>
            <td>Jam</td>
            <td>{ekstrakurikuler.jam}</td>
          </tr>
        </tbody>
      </table>
      <div className="absensi-container">
        <button className="btn-absensi-pertemuan" onClick={onPertemuan}>
          <img src={userIcon} alt="Absensi Pertemuan" /> Absensi Pertemuan
        </button>
      </div>
      {showSuccess && (
        <div className="toast-success">Pertemuan berhasil ditambahkan</div>
      )}
    </div>
  );
}
