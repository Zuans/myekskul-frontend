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
    const { _id: id } = JSON.parse(localStorage.getItem("guruData") || "{}");
    try {
      const response = await axios.get(`${apiURL}/api/guru/qr/${id}`);
      console.log(response.data, "link", `${apiURL}/api/guru/qr/${id}`);
      const { qr, guru } = response.data; // Simpan data base64 yang dikembalikan API

      // Cek apakah data base64 valid
      if (!qr.startsWith("data:image/png;base64,")) {
        throw new Error("Format base64 tidak valid");
      }

      // Buat elemen `<a>` untuk mengunduh gambar
      const link = document.createElement("a");
      link.href = qr;
      link.download = `QR_Guru_${guru.nama}.png`; // Tentukan nama file
      document.body.appendChild(link);
      link.click(); // Trigger download

      // Hapus elemen setelah download selesai
      document.body.removeChild(link);
      navigate("/");
    } catch (err) {
      console.error("Error downloading QR code:", err);
      alert("Gagal mengunduh QR code. Silakan coba lagi.");
    }
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
