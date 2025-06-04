import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/sidebar.css";
import berandaIcon from "../assets/icon/beranda.png";
import siswaIcon from "../assets/icon/user.png";
import ekstrakurikulerIcon from "../assets/icon/ekstrakurikuler.png";
import jadwalIcon from "../assets/icon/jadwal.png";
import laporanIcon from "../assets/icon/laporan.png";
import logoutIcon from "../assets/icon/logout.png";
import axios from "axios";
import downloadQRIcon from "../assets/icon/download.png";
import { jsPDF } from "jspdf";

function Sidebar({ show, onClose, setIsLoggedIn, apiURL }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  // Handler agar sidebar menutup otomatis di mobile
  const handleNavClick = async () => {
    if (window.innerWidth <= 900) {
      onClose();
    }
  };

  const handleDownloadQR = async () => {
    const { _id: id } = JSON.parse(localStorage.getItem("userData") || "{}");

    try {
      console.log(`${apiURL}/api/guru/qr/${id}`);
      const response = await axios.get(`${apiURL}/api/guru/qr/${id}`);
      const { qr, guru } = response.data; // Simpan data base64 yang dikembalikan API

      // Cek apakah data base64 valid
      if (!qr.startsWith("data:image/png;base64,")) {
        throw new Error("Format base64 tidak valid");
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = qr;
      img.onload = async () => {
        // Ukuran final untuk QR kartu guru (8.5 × 10.5 cm pada 150 DPI)
        const cardWidth = 503;
        const cardHeight = 621;
        const paddingTop = 50; // Ruang untuk nama sekolah
        const paddingBottom = 70; // Ruang untuk info guru
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

        // Gambar background teks guru (bawah)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, qrSize + paddingTop + qrY, cardWidth, paddingBottom);

        // Border kartu guru
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#27548a";
        ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);

        // Tambahkan nama & jabatan guru
        ctx.font = "bold 26px Poppins";
        ctx.fillStyle = "#27548a";
        ctx.fillText(guru.nama, cardWidth / 2, qrSize + paddingTop + qrY + 40);
        ctx.fillText(
          `- Guru Ekstrakurikuler -`,
          cardWidth / 2,
          qrSize + paddingTop + qrY + 80
        );

        // Simpan sebagai PDF agar tidak berubah ukuran di Google Docs
        saveAsPDF(canvas.toDataURL("image/png"), guru.nama);
      };
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Gagal mengunduh QR code. Silakan coba lagi.");
    }
  };

  // Fungsi untuk menyimpan gambar sebagai PDF agar tidak berubah ukuran saat dimasukkan ke Google Docs
  const saveAsPDF = (imageSrc, namaGuru) => {
    const doc = new jsPDF({
      unit: "cm",
      format: [8.5, 10.5], // Ukuran sesuai cetak
    });

    doc.addImage(imageSrc, "PNG", 0, 0, 8.5, 10.5);
    doc.save(`Kartu_Guru_${namaGuru}.pdf`);
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
            <li>
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
                  src={laporanIcon}
                  alt="Laporan Absensi"
                  className="sidebar-icon"
                />
                Riwayat Absensi
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
      </ul>
    </aside>
  );
}

export default Sidebar;
