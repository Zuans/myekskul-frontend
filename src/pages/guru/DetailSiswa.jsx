import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import downloadIcon from "../../assets/icon/download.png";
import editIcon from "../../assets/icon/edit.png";
import deleteIcon from "../../assets/icon/delete.png";
import axios from "axios";
import { jsPDF } from "jspdf";

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
      const { barcode, siswa } = response.data;

      if (!barcode.startsWith("data:image/png;base64,")) {
        throw new Error("Format base64 tidak valid");
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = barcode;
      img.onload = async () => {
        // Ukuran kartu siswa (8.5 × 10.5 cm pada 150 DPI)
        const cardWidth = 503;
        const cardHeight = 621;
        const paddingTop = 50; // Ruang untuk nama sekolah
        const paddingBottom = 70; // Ruang untuk info siswa
        const qrSize = 250; // Ukuran QR Code

        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Gambar background sekolah (atas)
        ctx.fillStyle = "#27548a";
        ctx.fillRect(0, 0, cardWidth, paddingTop);
        ctx.font = "bold 28px Poppins";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("SMP Anugerah Abadi", cardWidth / 2, paddingTop - 20);

        // Posisi QR Code di tengah kartu
        const qrX = (cardWidth - qrSize) / 2;
        const qrY = (cardHeight - qrSize - paddingTop - paddingBottom) / 2;
        ctx.drawImage(img, qrX, qrY + paddingTop, qrSize, qrSize);

        // Gambar background teks siswa (bawah)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, qrSize + paddingTop + qrY, cardWidth, paddingBottom);

        // Border kartu siswa
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#27548a";
        ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);

        // Tambahkan nama & kelas siswa
        ctx.font = "bold 26px Poppins";
        ctx.fillStyle = "#27548a";
        ctx.fillText(siswa.nama, cardWidth / 2, qrSize + paddingTop + qrY + 40);
        ctx.fillText(
          `Kelas ${siswa.kelas}`,
          cardWidth / 2,
          qrSize + paddingTop + qrY + 80
        );

        // Simpan sebagai PDF agar tidak berubah ukuran di Google Docs
        saveAsPDF(canvas.toDataURL("image/png"), siswa.nama);
      };
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Gagal mengunduh QR code. Silakan coba lagi.");
    }
  };

  // Fungsi untuk menyimpan gambar sebagai PDF agar tidak berubah ukuran saat dimasukkan ke Google Docs
  const saveAsPDF = (imageSrc, namaSiswa) => {
    const doc = new jsPDF({
      unit: "cm",
      format: [8.5, 10.5], // Ukuran sesuai cetak
    });

    doc.addImage(imageSrc, "PNG", 0, 0, 8.5, 10.5);
    doc.save(`Kartu_Siswa_${namaSiswa}.pdf`);
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
