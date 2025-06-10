import React, { useState, useEffect } from "react";
import "../../style/siswaDashboard.css";
import downloadIcon from "../../assets/icon/download.png";
import axios from "axios";

export default function DashboardSiswa({ apiURL }) {
  const [data, setData] = useState(null);
  const [absensi, setAbsensi] = useState([]);
  const [persentaseBulan, setPersentaseBulan] = useState();
  const [jadwalNanti, setJadwalNanti] = useState();
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      setData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  useEffect(() => {
    if (data) {
      getAbsensiTerakhir(data);
      getPersentaseBulanIni(data);
      getJadwalNanti(data);
    }
  }, [data]);

  useEffect(() => {
    console.log("persentase diperbarui", persentaseBulan);
  }, [persentaseBulan]);
  const getPersentaseBulanIni = async (data) => {
    try {
      const response = await axios.get(
        `${apiURL}/api/siswa/persentase-bulan/${data._id}`
      );
      setPersentaseBulan(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error when get absensi:", error);
    }
  };

  const getJadwalNanti = async (data) => {
    try {
      const response = await axios.get(
        `${apiURL}/api/siswa/jadwal-nanti/${data._id}`
      );
      setJadwalNanti(response.data);
    } catch (error) {
      console.error("Error when get absensi:", error);
    }
  };

  const getAbsensiTerakhir = async (data) => {
    try {
      const response = await axios.get(
        `${apiURL}/api/siswa/absensi-terakhir/${data._id}`
      );
      setAbsensi(response.data);
    } catch (error) {
      console.error("Error when get absensi:", error);
    }
  };

  const downloadQRSiswa = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/siswa/qr/${data._id}`);
      const { barcode, siswa } = response.data;

      if (!barcode.startsWith("data:image/png;base64,")) {
        throw new Error("Format base64 tidak valid");
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = barcode;
      img.onload = () => {
        // Ukuran kartu: 1003 x 1240 px (setara 8.5 x 10.5 cm pada 300 DPI)
        const cardWidth = 1003;
        const cardHeight = 1240;
        const paddingTop = 100; // Ruang atas (judul)
        const paddingBottom = 160; // Ruang bawah (nama dan kelas)
        const qrSize = 500;

        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Bagian atas (judul sekolah)
        ctx.fillStyle = "#27548a";
        ctx.fillRect(0, 0, cardWidth, paddingTop);
        ctx.font = "bold 52px Poppins";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SMP Anugerah Abadi", cardWidth / 2, paddingTop / 2);

        // Posisi QR code
        const qrX = (cardWidth - qrSize) / 2;
        const qrY = (cardHeight - qrSize - paddingTop - paddingBottom) / 2;
        ctx.drawImage(img, qrX, qrY + paddingTop, qrSize, qrSize);

        // Background bawah (untuk teks)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, qrSize + paddingTop + qrY, cardWidth, paddingBottom);

        // Border luar kartu
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#27548a";
        ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);

        // Teks nama & kelas siswa
        ctx.font = "bold 48px Poppins";
        ctx.fillStyle = "#27548a";
        ctx.fillText(siswa.nama, cardWidth / 2, qrSize + paddingTop + qrY + 60);
        ctx.fillText(
          `Kelas ${siswa.kelas}`,
          cardWidth / 2,
          qrSize + paddingTop + qrY + 120
        );

        // Simpan sebagai gambar PNG
        const finalImage = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = finalImage;
        link.download = `Kartu_Siswa_${siswa.nama}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Gagal mengunduh QR code. Silakan coba lagi.");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="dashboard-siswa-container">
      {/* 1. Ucapan Selamat Datang */}
      <h2 className="dashboard-siswa-title">Selamat Datang, {data.nama}!</h2>

      {/* 2. Keterangan kelas + tombol download QR */}
      <div className="dashboard-siswa-kelas-qr-row">
        <div className="dashboard-siswa-kelas-info">
          <strong>Kelas:</strong> {data.kelas}
        </div>
        <button
          className="dashboard-siswa-btn-download-qr"
          onClick={downloadQRSiswa}
        >
          <img src={downloadIcon} alt="" /> Download QR
        </button>
      </div>

      {/* 3. Tabel Riwayat Absensi */}
      <div className="dashboard-siswa-riwayat-absensi">
        <h2 className="dashboard-siswa-card-title">Riwayat Absensi</h2>
        <div className="dashboard-siswa-table-container">
          <table className="dashboard-siswa-table-riwayat-siswa">
            <thead>
              <tr>
                <th>No</th>
                <th>Kegiatan</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {absensi && absensi.length > 0 ? (
                absensi.slice(0, 5).map((absen, idx) => (
                  <tr key={absen._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{absen.nama_ekstrakurikuler}</td>
                    <td>{absen.waktu_scan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Belum ada riwayat absensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Persentase Kehadiran & Jadwal Ekstrakurikuler */}
      <div className="dashboard-siswa-absensi-jadwal-row">
        <div className="dashboard-siswa-persentase-kehadiran">
          <h2 className="dashboard-siswa-card-title">
            Persentase Kehadiran Bulan Ini
          </h2>
          <ul className="dashboard-siswa-progress-list">
            {persentaseBulan && persentaseBulan.dataPerEkstrakurikuler ? (
              Object.entries(persentaseBulan.dataPerEkstrakurikuler).map(
                ([idEkstrakurikuler, ekstrakurikuler]) => (
                  <li key={idEkstrakurikuler}>
                    <div className="dashboard-siswa-progress-info">
                      <span className="dashboard-siswa-progress-nama">
                        {ekstrakurikuler.namaEkstrakurikuler}
                      </span>
                      <span className="dashboard-siswa-progress-nama">
                        {ekstrakurikuler.persentaseKehadiran}
                      </span>
                    </div>
                    <div className="dashboard-siswa-progress-bar">
                      <div
                        className="dashboard-siswa-progress-fill"
                        style={{ width: ekstrakurikuler.persentaseKehadiran }}
                      ></div>
                    </div>
                  </li>
                )
              )
            ) : (
              <li>
                <span className="dashboard-siswa-progress-nama">
                  Tidak ada data
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="dashboard-siswa-dashboard-card dashboard-siswa-card-2">
          <h2 className="dashboard-siswa-card-title">Jadwal Nanti</h2>
          <ul className="dashboard-siswa-jadwal-nanti-list">
            {jadwalNanti && jadwalNanti.jadwalNanti ? (
              jadwalNanti.jadwalNanti.map((schedule, index) => (
                <li key={index} className="dashboard-siswa-jadwal-nanti-item">
                  <span className="dashboard-siswa-jadwal-nanti-tanggal">
                    {schedule.tanggal}
                  </span>
                  <span className="dashboard-siswa-jadwal-nanti-nama">
                    {schedule.namaEkstrakurikuler}
                  </span>
                  <span className="dashboard-siswa-jadwal-nanti-hari">
                    {schedule.hari}
                  </span>
                </li>
              ))
            ) : (
              <li className="dashboard-siswa-jadwal-nanti-item">
                <span className="dashboard-siswa-jadwal-nanti-nama">
                  Tidak ada jadwal tersedia
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
