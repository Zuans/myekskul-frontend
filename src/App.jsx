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
  const isProd = true;
  const apiURL = isProd
    ? "https://myekskul-backend-production.up.railway.app"
    : "http://localhost:7878";

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
              path="/"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                  apiURL={apiURL}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                  apiURL={apiURL}
                />
              }
            />
            <Route
              path="/daftar"
              element={
                <RegisterPage setIsLoggedIn={setIsLoggedIn} apiURL={apiURL} />
              }
            />
            <Route
              path="/qr"
              element={
                <GuruLoginScan
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                  apiURL={apiURL}
                />
              }
            />
            <Route
              path="*"
              lement={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                  apiURL={apiURL}
                />
              }
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
                apiURL={apiURL}
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
                        element={<EkstrakurikulerPage apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/tambah"
                        element={<EkstrakurikulerTambah apiURL={apiURL} />}
                      />
                      <Route
                        path="/siswa/tambah"
                        element={<TambahSiswa apiURL={apiURL} />}
                      />
                      <Route
                        path="/siswa/ubah/:id"
                        element={<UbahSiswa apiURL={apiURL} />}
                      />
                    </>
                  )}
                  {userRole === "guru" && (
                    <>
                      <Route
                        path="/"
                        element={<DashboardPage apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler"
                        element={<EkstrakurikulerPage apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/detail/:id"
                        element={<EkstrakurikulerDetailPage apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/tambah"
                        element={<EkstrakurikulerTambah apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/tambah/siswa/:id"
                        element={<SiswaTambahScan apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/ubah/:id"
                        element={<EkstrakurikulerUbah apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/siswa/:idEkstrakurikuler"
                        element={<EkstrakurikulerDaftarSiswa apiURL={apiURL} />}
                      />
                      <Route
                        path="/ekstrakurikuler/siswa/scan/:idEkstrakurikuler"
                        element={<EkstrakurikulerScanAbsen apiURL={apiURL} />}
                      />
                      <Route
                        path="/siswa"
                        element={<SiswaPage apiURL={apiURL} />}
                      />
                      <Route
                        path="/siswa/tambah"
                        element={<TambahSiswa apiURL={apiURL} />}
                      />
                      <Route
                        path="/siswa/ubah/:id"
                        element={<UbahSiswa apiURL={apiURL} />}
                      />
                      <Route
                        path="/detailsiswa/:id"
                        element={<DetailSiswa apiURL={apiURL} />}
                      />
                      <Route
                        path="/jadwal"
                        element={<Jadwal apiURL={apiURL} />}
                      />
                      <Route
                        path="/laporanAbsensi"
                        element={<LaporanAbsensi apiURL={apiURL} />}
                      />
                      <Route
                        path="/laporanAbsensi/:kegiatan/:id/"
                        element={<LaporanAbsensiDetail apiURL={apiURL} />}
                      />
                      <Route
                        path="/laporanAbsensi/pertemuan/:kegiatan/:id/"
                        element={
                          <LaporanAbsensDaftarPertemuanTable apiURL={apiURL} />
                        }
                      />
                      <Route
                        path="/laporanAbsensi/detail/:tanggal"
                        element={<DetailAbsensi apiURL={apiURL} />}
                      />
                    </>
                  )}
                  {userRole === "siswa" && (
                    <>
                      <Route
                        path="/"
                        element={<SiswaDashboard apiURL={apiURL} />}
                      />
                      <Route
                        path="/jadwal-siswa"
                        element={<SiswaJadwal apiURL={apiURL} />}
                      />
                      <Route
                        path="/riwayat-absensi"
                        element={<SiswaRiwayatAbsensi apiURL={apiURL} />}
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
