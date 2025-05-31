import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/guru/LoginPage.jsx";
import GuruLoginScan from "./pages/guru/GuruLoginScan.jsx";
import RegisterPage from "./pages/guru/RegisterPage.jsx";
import DashboardPage from "./pages/guru/DashboardPage.jsx";
import EkstrakurikulerPage from "./pages/guru/EkstrakurikulerPage.jsx";
import SiswaPage from "./pages/guru/SiswaPage.jsx";
import DetailSiswa from "./pages/guru/DetailSiswa";
import TambahSiswa from "./pages/guru/TambahSiswa.jsx";
import UbahSiswa from "./pages/guru/UbahSiswa.jsx";
import EkstrakurikulerDetailPage from "./pages/guru/EkstrakurikulerDetailPage.jsx";
import EkstrakurikulerTambah from "./pages/guru/EkstrakurikulerTambah.jsx";
import EkstrakurikulerUbah from "./pages/guru/EkstrakurikulerUbah.jsx";
import EkstrakurikulerDaftarSiswa from "./pages/guru/EkstrakurikulerDaftarSiswa.jsx";
import SiswaTambahScan from "./pages/guru/SiswaTambahScan.jsx";
import EkstrakurikulerScanAbsen from "./pages/guru/EkstrakurikulerScanAbsen.jsx";
import Jadwal from "./pages/guru/Jadwal.jsx";
import LaporanAbsensi from "./pages/guru/LaporanAbsensi.jsx";
import LaporanAbsensiDetail from "./pages/guru/LaporanAbsensiDetail.jsx";
import LaporanAbsensDaftarPertemuanTable from "./pages/guru/LaporanAbsensDaftarPertemuanTable.jsx";
import DetailAbsensi from "./pages/guru/DetailAbsensi.jsx";
import SiswaDashboard from "./pages/siswa/SiswaDashboard.jsx";
import SiswaJadwal from "./pages/siswa/SiswaJadwal.jsx";
import SiswaRiwayatAbsensi from "./pages/siswa/SiswaRiwayatAbsensi.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const [dataUser, setDataUser] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };

    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setUserRole(localStorage.getItem("userRole"));
    setDataUser(JSON.parse(localStorage.getItem("userData")) || {});

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userRole]);

  return (
    <BrowserRouter>
      {" "}
      <div className="app">
        {" "}
        {!isLoggedIn ? (
          <Routes>
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                />
              }
            />
            <Route
              path="/daftar"
              element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/qr"
              element={
                <GuruLoginScan
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                />
              }
            />
            <Route
              path="*"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />
          </Routes>
        ) : (
          <>
            {" "}
            <Header
              onHamburgerClick={() => setSidebarOpen((open) => !open)}
              sidebarOpen={sidebarOpen}
            />{" "}
            <div className="main">
              {" "}
              <Sidebar
                show={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                setIsLoggedIn={setIsLoggedIn}
              />{" "}
              {sidebarOpen && (
                <div
                  className="sidebar-overlay"
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.2)",
                    zIndex: 99,
                    display: "block",
                  }}
                />
              )}{" "}
              <div className="content" style={{ flex: 1, padding: 32 }}>
                {" "}
                <Routes>
                  {" "}
                  {userRole === "admin" && (
                    <>
                      <Route
                        path="/ekstrakurikuler"
                        element={<EkstrakurikulerPage />}
                      />
                      <Route
                        path="/ekstrakurikuler/tambah"
                        element={<EkstrakurikulerTambah />}
                      />
                      <Route path="/siswa/tambah" element={<TambahSiswa />} />
                      <Route path="/siswa/ubah/:id" element={<UbahSiswa />} />
                    </>
                  )}
                  {/* Route khusus Guru */}
                  {userRole === "guru" && (
                    <>
                      <Route path="/" element={<DashboardPage />} />{" "}
                      <Route
                        path="/ekstrakurikuler"
                        element={<EkstrakurikulerPage />}
                      />{" "}
                      <Route
                        path="/ekstrakurikuler/detail/:id"
                        element={<EkstrakurikulerDetailPage />}
                      />{" "}
                      <Route
                        path="/ekstrakurikuler/tambah"
                        element={<EkstrakurikulerTambah />}
                      />{" "}
                      <Route
                        path="/ekstrakurikuler/tambah/siswa/:id"
                        element={<SiswaTambahScan />}
                      />{" "}
                      <Route
                        path="/ekstrakurikuler/ubah/:id"
                        element={<EkstrakurikulerUbah />}
                      />{" "}
                      <Route
                        path="/ekstrakurikuler/siswa/:idEkstrakurikuler"
                        element={<EkstrakurikulerDaftarSiswa />}
                      />{" "}
                      <Route
                        path="/ekstrakurikuler/siswa/scan/:idEkstrakurikuler"
                        element={<EkstrakurikulerScanAbsen />}
                      />{" "}
                      <Route path="/siswa" element={<SiswaPage />} />{" "}
                      <Route path="/siswa/tambah" element={<TambahSiswa />} />{" "}
                      <Route path="/siswa/ubah/:id" element={<UbahSiswa />} />{" "}
                      SiswaScanAbsen{" "}
                      <Route
                        path="/detailsiswa/:id"
                        element={<DetailSiswa />}
                      />{" "}
                      <Route path="/jadwal" element={<Jadwal />} />{" "}
                      <Route
                        path="/laporanAbsensi"
                        element={<LaporanAbsensi />}
                      />{" "}
                      <Route
                        path="/laporanAbsensi/:kegiatan/:id/"
                        element={<LaporanAbsensiDetail />}
                      />{" "}
                      <Route
                        path="/laporanAbsensi/pertemuan/:kegiatan/:id/"
                        element={<LaporanAbsensDaftarPertemuanTable />}
                      />{" "}
                      <Route
                        path="/laporanAbsensi/detail/:tanggal"
                        element={<DetailAbsensi />}
                      />{" "}
                      ''
                    </>
                  )}
                  {/* Route khusus Siswa */}
                  {userRole === "siswa" && (
                    <>
                      <Route path="/" element={<SiswaDashboard />} />
                      <Route path="/jadwal-siswa" element={<SiswaJadwal />} />
                      <Route
                        path="/riwayat-absensi"
                        element={<SiswaRiwayatAbsensi />}
                      />
                    </>
                  )}
                </Routes>{" "}
              </div>{" "}
            </div>{" "}
          </>
        )}{" "}
      </div>{" "}
    </BrowserRouter>
  );
}
export default App;
