import detailIcon from "../../assets/icon/detail.png";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import excelIcon from "../../assets/icon/excel.png";
import "../../style/laporanAbsensi.css";
import "../../style/ekstrakurikuler.css";
import axios from "axios";

const PAGE_SIZE = 5;

export default function LaporanAbsensDaftarPertemuanTable() {
  const navigate = useNavigate();
  const [ekstrakurikuler, setEkstrakurikuler] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "bulan") {
      handleViewMonth();
    } else if (buttonName === "semester") {
      handleViewSemester();
    } else if (buttonName === "all") {
      handleViewAll();
    }
  };

  const { id: idEkstrakurikuler, kegiatan } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/absensi/daftarTanggal/${idEkstrakurikuler}` // Ganti dengan ID guru yang sesuai
      );
      setEkstrakurikuler([...response.data]);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [page, setPage] = useState(1);

  const totalPage = Math.ceil(ekstrakurikuler.length / PAGE_SIZE);
  const pagedData = ekstrakurikuler.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  const onExport = async () => {
    if (activeButton === "bulan") {
      try {
        const response = await axios.get(
          `http://localhost:7878/api/absensi/daftar/export/bulanIni/${idEkstrakurikuler}`, // Ganti dengan ID guru yang sesuai
          {
            responseType: "blob",
          }
        );

        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const now = new Date();
        const namaBulan = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        const bulanIni = namaBulan[now.getMonth()]; // getMonth() mulai dari 0
        const tahunIni = now.getFullYear();

        link.setAttribute(
          "download",
          `data absensi ${kegiatan} ${bulanIni} ${tahunIni}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Gagal mengunduh file. Coba lagi nanti.");
      }
    } else if (activeButton === "semester") {
      try {
        const response = await axios.get(
          `http://localhost:7878/api/absensi/daftar/export/semesterIni/${idEkstrakurikuler}`, // Ganti dengan ID guru yang sesuai
          {
            responseType: "blob",
          }
        );

        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const now = new Date();
        const bulan = now.getMonth(); // 0 = Januari, 11 = Desember
        const tahun = now.getFullYear();

        const semester = bulan < 6 ? "Ganjil" : "Genap";

        link.setAttribute(
          "download",
          `data absensi ${kegiatan} Semester ${semester} ${tahun}.xlsx`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Gagal mengunduh file. Coba lagi nanti.");
      }
    }
  };

  const handleViewMonth = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/absensi/daftar/bulanIni/${idEkstrakurikuler}` // Ganti dengan ID guru yang sesuai
      );
      setEkstrakurikuler([...response.data]);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleViewSemester = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7878/api/absensi/daftar/semesterIni/${idEkstrakurikuler}` // Ganti dengan ID guru yang sesuai
      );
      console.log(response.data);
      setEkstrakurikuler([...response.data.data]);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleViewAll = async () => {
    fetchData();
  };

  return (
    <div className="laporan-absensi-table-mobile">
      <h2 className="title">Daftar Pertemuan - {kegiatan} </h2>
      <div className="laporan-absensi-search-container">
        <div className="laporan-absensi-buttons">
          <button
            className={`laporan-absensi-btn ${
              activeButton === "bulan" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("bulan")}
          >
            Lihat Bulan Ini
          </button>

          <button
            className={`laporan-absensi-btn ${
              activeButton === "semester" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("semester")}
          >
            Lihat Semester Ini
          </button>

          <button
            className={`laporan-absensi-btn ${
              activeButton === "all" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("all")}
          >
            Lihat Semua Data
          </button>

          <button
            className={`laporan-absensi-btn ${
              activeButton === "export" ? "active" : ""
            }`}
            onClick={onExport}
          >
            Export Data
          </button>
        </div>
      </div>

      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Tanggal
            </th>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {pagedData.map((pertemuan, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {pertemuan.tanggal}
              </td>
              <td>
                <button
                  className="btn-aksi btn-detail"
                  title="Detail"
                  onClick={() =>
                    navigate(
                      `/laporanAbsensi/detail/${pertemuan.tanggal}?ekstrakurikuler=${idEkstrakurikuler}`
                    )
                  }
                >
                  <img src={detailIcon} alt="Detail" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="laporan-absensi-table-footer-container">
        <div className="laporan-absensi-pagination-nav">
          <button
            className="laporan-absensi-btn-page"
            onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>

          {[...Array(totalPage)].map((_, i) => {
            if (i + 1 === page || i + 1 === page - 1 || i + 1 === page + 1) {
              return (
                <button
                  key={i}
                  className={`laporan-absensi-btn-page${
                    page === i + 1 ? " active" : ""
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              );
            }
            return null;
          })}

          <button
            className="laporan-absensi-btn-page"
            onClick={() =>
              handlePageChange(page < totalPage ? page + 1 : totalPage)
            }
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
        <div className="laporan-absensi-export-nav">
          <button className="laporan-absensi-btn-export" onClick={onExport}>
            <img src={excelIcon} alt="Export Absensi" /> Export Absensi
          </button>
        </div>
      </div>
    </div>
  );
}
