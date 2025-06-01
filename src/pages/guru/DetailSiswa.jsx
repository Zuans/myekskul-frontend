import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import downloadIcon from "../../assets/icon/download.png";
import editIcon from "../../assets/icon/edit.png";
import deleteIcon from "../../assets/icon/delete.png";
import axios from "axios";

export default function DetailSiswa({ apiURL }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [siswa, setSiswa] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/siswa/id/${id}`);
        const data = await response.data;
        console.log(data);
        const dataSiswa = [
          ["Nama", data.nama],
          ["Kelas", data.kelas],
          ["Ekstrakulikuler", data.esktrakulikuler],
        ];
        setSiswa(dataSiswa);
      } catch (err) {
        setError("Data siswa tidak ditemukan.", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const downloadQRSiswa = async (id) => {
    try {
      const response = await axios.get(`${apiURL}/api/siswa/qr/${id}`);
      const { barcode, siswa } = response.data; // Simpan data base64 yang dikembalikan API

      // Cek apakah data base64 valid
      if (!barcode.startsWith("data:image/png;base64,")) {
        throw new Error("Format base64 tidak valid");
      }

      // Buat elemen `<a>` untuk mengunduh gambar
      const link = document.createElement("a");
      link.href = barcode;
      link.download = `QR_Siswa_${siswa.nama}.png`; // Tentukan nama file
      document.body.appendChild(link);
      link.click(); // Trigger download

      // Hapus elemen setelah download selesai
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Gagal mengunduh QR code. Silakan coba lagi.");
    }
  };

  const handleDeleteClick = () => {
    setShowToast(true);
  };

  const handleConfirmDelete = async () => {
    setShowToast(false);
    setShowToast(false);

    try {
      await axios.delete(`${apiURL}/api/siswa/${id}`);
    } catch (err) {
      console.error("Error when deleting data:", err);
    }
    // Lakukan proses hapus detail siswa di sini
    // Misal: redirect atau tampilkan notifikasi sukses
    navigate("/siswa", { state: { success: "Data siswa berhasil dihapus!" } });
  };

  const handleCancelDelete = () => {
    setShowToast(false);
  };

  if (loading) return <p>Loading data...</p>;

  // Jika terjadi error atau data kosong, tampilkan pesan error
  if (error || !siswa)
    return (
      <p style={{ color: "red" }}>{error || "Data siswa tidak ditemukan."}</p>
    );

  return (
    <div>
      <h2 className="title">Detail Siswa</h2>
      <table className="detail-table">
        <thead>
          <tr>
            <th
              colSpan={2}
              style={{
                background: "var(--primary-blue)",
                height: "18px",
                padding: 0,
              }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {siswa.map((row, idx) => (
            <tr key={idx}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="detail-actions">
        <button
          className="btn-detail-action download"
          onClick={() => downloadQRSiswa(id)}
        >
          <img src={downloadIcon} alt="Download QR" /> Download QR
        </button>
        <button
          className="btn-detail-action edit"
          onClick={() => navigate(`/siswa/ubah/${id}`)}
        >
          <img src={editIcon} alt="Ubah" /> Ubah
        </button>
        <button
          className="btn-detail-action delete"
          onClick={handleDeleteClick}
        >
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
    </div>
  );
}
