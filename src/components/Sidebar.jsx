import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/sidebar.css";
import berandaIcon from "../assets/icon/beranda.png";
import siswaIcon from "../assets/icon/user.png";
import ekstrakurikulerIcon from "../assets/icon/ekstrakurikuler.png";
import jadwalIcon from "../assets/icon/jadwal.png";
import laporanIcon from "../assets/icon/laporan.png";
import logoutIcon from "../assets/icon/logout.png";
import guruIcon from "../assets/icon/guru.png";
import settingIcon from "../assets/icon/setting.png";
import axios from "axios";
import downloadQRIcon from "../assets/icon/download.png";
import { useState } from "react";

function Sidebar({ show, onClose, setIsLoggedIn, apiURL }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [guruData, setGuruData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  // Handler agar sidebar menutup otomatis di mobile
  const handleNavClick = async () => {
    if (window.innerWidth <= 900) {
      onClose();
    }
  };

  const handleDownloadQR = async () => {
    const { _id: id } = JSON.parse(localStorage.getItem("userData") || "{}");

    try {
      const response = await axios.get(`${apiURL}/api/guru/qr/${id}`);
      const { qr, guru } = response.data;

      // Validasi base64 QR code
      if (!qr.startsWith("data:image/png;base64,")) {
        throw new Error("Format base64 tidak valid");
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = qr;
      img.onload = () => {
        // Ukuran untuk 8.5cm x 10.5cm @ 300 DPI
        const cardWidth = 1003; // ≈ 8.5 cm
        const cardHeight = 1240; // ≈ 10.5 cm
        const paddingTop = 100;
        const paddingBottom = 160;
        const qrSize = 500;

        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Background biru (atas)
        ctx.fillStyle = "#27548a";
        ctx.fillRect(0, 0, cardWidth, paddingTop);

        // Teks nama sekolah
        ctx.font = "bold 52px Poppins";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("SMP Anugerah Abadi", cardWidth / 2, paddingTop - 30);

        // QR Code (tengah)
        const qrX = (cardWidth - qrSize) / 2;
        const qrY = (cardHeight - qrSize - paddingTop - paddingBottom) / 2;
        ctx.drawImage(img, qrX, qrY + paddingTop, qrSize, qrSize);

        // Background putih (bawah)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, qrSize + paddingTop + qrY, cardWidth, paddingBottom);

        // Border kartu
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#27548a";
        ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);

        // Teks nama dan jabatan
        ctx.font = "bold 48px Poppins";
        ctx.fillStyle = "#27548a";
        ctx.fillText(guru.nama, cardWidth / 2, qrSize + paddingTop + qrY + 60);
        ctx.fillText(
          "Guru SMP Anugerah Abadi",
          cardWidth / 2,
          qrSize + paddingTop + qrY + 120
        );

        // Simpan sebagai gambar PNG
        saveAsImage(canvas.toDataURL("image/png"), guru.nama);
      };
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Gagal mengunduh QR code. Silakan coba lagi.");
    }
  };

  // Fungsi menyimpan gambar
  const saveAsImage = (dataURL, namaGuru) => {
    const link = document.createElement("a");
    link.download = `Kartu_Guru_${namaGuru}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("guruData");
    localStorage.removeItem("userRole");
    setIsLoggedIn(localStorage.setItem("isLoggedIn", false));
    navigate("/login", { state: { successLogout: "Berhasil Logout" } });
  };
  // Cek apakah user sudah login

  return (
    <aside className={`sidebar${show ? " show" : ""}`}>
      <button
        className="sidebar-close"
        onClick={onClose}
        aria-label="Tutup Menu"
      >
        &times;
      </button>
      <ul>
        {userRole === "admin" && (
          <>
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/" onClick={handleNavClick}>
                <img src={berandaIcon} alt="Beranda" className="sidebar-icon" />
                Beranda
              </Link>
            </li>
            <li className={location.pathname === "/guru" ? "active" : ""}>
              <Link to="/guru" onClick={handleNavClick}>
                <img src={guruIcon} alt="Guru" className="sidebar-icon" />
                Guru
              </Link>
            </li>
            <li
              className={location.pathname.startsWith("/siswa") ? "active" : ""}
            >
              <Link to="/siswa" onClick={handleNavClick}>
                <img src={siswaIcon} alt="Siswa" className="sidebar-icon" />
                Siswa
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/ekstrakurikuler") ? "active" : ""
              }
            >
              <Link to="/ekstrakurikuler" onClick={handleNavClick}>
                <img
                  src={ekstrakurikulerIcon}
                  alt="Ekstrakurikuler"
                  className="sidebar-icon"
                />
                Ekstrakurikuler
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/jadwal") ? "active" : ""
              }
            >
              <Link to="/jadwal" onClick={handleNavClick}>
                <img
                  src={jadwalIcon}
                  alt="Jadwal Kegiatan"
                  className="sidebar-icon"
                />
                Jadwal Kegiatan
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/laporanAbsensi") ? "active" : ""
              }
            >
              <Link to="/laporanAbsensi" onClick={handleNavClick}>
                <img
                  src={laporanIcon}
                  alt="Laporan Absensi"
                  className="sidebar-icon"
                />
                Laporan Absensi
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/downloadQR") ? "active" : ""
              }
            >
              <a href="" onClick={handleLogout}>
                {" "}
                <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
                Logout
              </a>
            </li>
          </>
        )}

        {/* Menu untuk Guru */}
        {userRole === "guru" && (
          <>
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/" onClick={handleNavClick}>
                <img src={berandaIcon} alt="Beranda" className="sidebar-icon" />
                Beranda
              </Link>
            </li>
            <li
              className={location.pathname.startsWith("/siswa") ? "active" : ""}
            >
              <Link to="/siswa" onClick={handleNavClick}>
                <img src={siswaIcon} alt="Siswa" className="sidebar-icon" />
                Siswa
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/ekstrakurikuler") ? "active" : ""
              }
            >
              <Link to="/ekstrakurikuler" onClick={handleNavClick}>
                <img
                  src={ekstrakurikulerIcon}
                  alt="Ekstrakurikuler"
                  className="sidebar-icon"
                />
                Ekstrakurikuler
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/jadwal") ? "active" : ""
              }
            >
              <Link to="/jadwal" onClick={handleNavClick}>
                <img
                  src={jadwalIcon}
                  alt="Jadwal Kegiatan"
                  className="sidebar-icon"
                />
                Jadwal Kegiatan
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/laporanAbsensi") ? "active" : ""
              }
            >
              <Link to="/laporanAbsensi" onClick={handleNavClick}>
                <img
                  src={laporanIcon}
                  alt="Laporan Absensi"
                  className="sidebar-icon"
                />
                Laporan Absensi
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/downloadQR") ? "active" : ""
              }
            >
              <Link to="/downloadQR" onClick={handleDownloadQR}>
                <img
                  src={downloadQRIcon}
                  alt="Download QR"
                  className="sidebar-icon"
                />
                Download QR
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/pengaturanAkun") ? "active" : ""
              }
            >
              <Link
                to={`/pengaturanAkun/${guruData._id}`}
                onClick={handleNavClick}
              >
                <img
                  src={settingIcon}
                  alt="Setting icon"
                  className="sidebar-icon"
                />
                Pengaturan Akun
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/downloadQR") ? "active" : ""
              }
            >
              <a href="" onClick={handleLogout}>
                {" "}
                <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
                Logout
              </a>
            </li>
          </>
        )}

        {/* Menu untuk Siswa */}
        {userRole === "siswa" && (
          <>
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/" onClick={handleNavClick}>
                <img src={berandaIcon} alt="Beranda" className="sidebar-icon" />
                Beranda
              </Link>
            </li>

            <li
              className={
                location.pathname.startsWith("/jadwal-siswa") ? "active" : ""
              }
            >
              <Link to="/jadwal-siswa" onClick={handleNavClick}>
                <img
                  src={jadwalIcon}
                  alt="Jadwal Kegiatan"
                  className="sidebar-icon"
                />
                Jadwal Kegiatan
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/riwayat-absensi") ? "active" : ""
              }
            >
              <Link to="/riwayat-absensi" onClick={handleNavClick}>
                <img
                  src={jadwalIcon}
                  alt="Laporan Absensi"
                  className="sidebar-icon"
                />
                Riwayat Absensi
              </Link>
            </li>
            <li
              className={
                location.pathname.startsWith("/logout") ? "active" : ""
              }
            >
              <a href="" onClick={handleLogout}>
                {" "}
                <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
