import "../../style/detailAbsensi.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

export default function DetailAbsensi({ apiURL }) {
  const { tanggal } = useParams();
  const [siswa, setSiswa] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [showSuccess, setShowSuccess] = useState(false);

  const ekstrakurikulerId = params.get("ekstrakurikuler");

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/absensi/daftar/${tanggal}/${ekstrakurikulerId}` // Ganti dengan ID guru yang sesuai
      );
      setSiswa(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const PAGE_SIZE = 5;
  const [selectedData, setSelectedData] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedData(siswa.map((data) => data.id_siswa)); // Pilih semua
    } else {
      setSelectedData([]); // Hapus semua pilihan
    }
  };

  // Fungsi untuk toggle pilihan per baris
  const handleSelectRow = (id) => {
    setSelectedData((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const [page, setPage] = useState(1);

  const totalPage = Math.ceil(siswa.length / PAGE_SIZE);
  const pagedData = siswa.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  const handleHadir = async () => {
    try {
      const filteredData = selectedData.filter((id) =>
        pagedData.some((data) => data.id_siswa === id)
      );

      if (filteredData.length === 0) {
        console.warn("Tidak ada siswa di halaman ini yang dipilih.");
        return;
      }

      await axios.put(
        `${apiURL}/api/absensi/selectHadir/${tanggal}/${ekstrakurikulerId}`,
        { selectedData: filteredData }
      );
      fetchData();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleAbsen = async () => {
    try {
      const filteredData = selectedData.filter((id) =>
        pagedData.some((data) => data.id_siswa === id)
      );

      if (filteredData.length === 0) {
        console.warn("Tidak ada siswa di halaman ini yang dipilih.");
        return;
      }

      await axios.put(
        `${apiURL}/api/absensi/selectAbsen/${tanggal}/${ekstrakurikulerId}`,
        { selectedData: filteredData }
      );
      fetchData();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="detail-absensi">
      <h2 className="title">Detail Absensi</h2>
      <table style={{ width: "100%" }} className="data-absensi-table">
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
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedData.length === siswa.length}
              />
            </th>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Nama
            </th>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Kelas
            </th>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {pagedData.map((data, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: "left" }}>
                <input
                  type="checkbox"
                  checked={selectedData.includes(data.id_siswa)}
                  onChange={() => handleSelectRow(data.id_siswa)}
                />
              </td>
              <td style={{ textAlign: "left" }}>{data.nama_siswa}</td>
              <td style={{ textAlign: "left" }}>{data.kelas}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color: data.status === "Hadir" ? "#2e8f5a" : "#d9534f",
                }}
              >
                {data.status}
                {data.waktuScan ? ` - ${data.waktuScan} ` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="data-absensi-actions-container">
        <button className="btn-hadir" onClick={handleHadir}>
          Hadir
        </button>
        <button className="btn-absen" onClick={handleAbsen}>
          Absen
        </button>
      </div>

      <div className="data-absensi-table-footer-container">
        <div className="data-absensi-pagination-nav">
          <button
            className="data-absensi-btn-page"
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
                  className={`data-absensi-btn-page${
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
            className="data-absensi-btn-page"
            onClick={() =>
              handlePageChange(page < totalPage ? page + 1 : totalPage)
            }
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
      </div>
      {showSuccess && <div className="toast-success">Data berhasil diubah</div>}
    </div>
  );
}
