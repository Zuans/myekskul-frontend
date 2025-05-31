import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import LoginQRPage from "./pages/LoginQRPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EkstrakurikulerPage from "./pages/EkstrakurikulerPage.jsx";
import SiswaPage from "./pages/SiswaPage.jsx";
import DetailSiswa from "./pages/DetailSiswa";
import TambahSiswa from "./pages/TambahSiswa.jsx";
import UbahSiswa from "./pages/UbahSiswa.jsx";
import EkstrakurikulerDetailPage from "./pages/EkstrakurikulerDetailPage.jsx";
import EkstrakurikulerTambah from "./pages/EkstrakurikulerTambah.jsx";
import EkstrakurikulerUbah from "./pages/EkstrakurikulerUbah.jsx";
import EkstrakurikulerDaftarSiswa from "./pages/EkstrakurikulerDaftarSiswa.jsx";
import SiswaTambahScan from "./pages/SiswaTambahScan.jsx";
import EkstrakurikulerScanAbsen from "./pages/EkstrakurikulerScanAbsen.jsx";
import Jadwal from "./pages/Jadwal.jsx";
import LaporanAbsensi from "./pages/LaporanAbsensi.jsx";
import LaporanAbsensiDetail from "./pages/LaporanAbsensiDetail.jsx";
import LaporanAbsensDaftarPertemuanTable from "./pages/LaporanAbsensDaftarPertemuanTable.jsx";
import DetailAbsensi from "./pages/DetailAbsensi.jsx";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);
  return (
    <BrowserRouter>
      {" "}
      <div className="app">
        {" "}
        {!isLoggedIn ? (
          <Routes>
            {" "}
            <Route
              path="/login"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />{" "}
            <Route
              path="/daftar"
              element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />}
            />{" "}
            <Route
              path="*"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />{" "}
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
                  <Route path="/detailsiswa/:id" element={<DetailSiswa />} />{" "}
                  <Route path="/jadwal" element={<Jadwal />} />{" "}
                  <Route path="/laporanAbsensi" element={<LaporanAbsensi />} />{" "}
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
