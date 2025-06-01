import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/siswa.css";
import addIcon from "../../assets/icon/add.png";
import searchIcon from "../../assets/icon/cari.png";
import downloadIcon from "../../assets/icon/download.png";
import editIcon from "../../assets/icon/edit.png";
import deleteIcon from "../../assets/icon/delete.png";
import excelIcon from "../../assets/icon/excel.png";
import SiswaTableMobile from "../../components/TableSiswaMobile.jsx";

const DATA_PER_PAGE = 5;

export default function SiswaPage({ apiURL }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSuccess, setShowSuccess] = useState(!!location.state?.success);
  const [siswa, setSiswa] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [page, setPage] = useState(1);
  const inputRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/siswa`);
      setSiswa(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
    }

    if (location.state?.error) {
      setShowError(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }

    if (showError) {
      const timer = setTimeout(() => setShowError(false), 1500);
      return () => clearTimeout(timer);
    }

    if (setShowNotFound) {
      const timer = setTimeout(() => setShowNotFound(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, showError, setShowNotFound]);

  const handleSearch = () => {
    const searchSiswa = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/api/siswa/search/${inputRef.current.value}`
        );
        setPage(1);
        setSiswa(response.data);
      } catch (err) {
        setShowNotFound(err);
        setSiswa([]);
      }
    };
    searchSiswa();
  };
  const getSiswaByKelas = async (kelas) => {
    try {
      const response = await axios.get(
        `${apiURL}/api/siswa/search/kelas/${kelas}`
      );
      setSiswa(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setSiswa([]);
    }
  };

  const onExport = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/siswa/export`,
        { siswa }, // Pastikan siswa adalah array
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "DataSiswa.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error mengunduh file:", error);
      alert("Terjadi kesalahan saat mengunduh file.");
    }
  };

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
      img.onload = () => {
        // Ukuran final untuk kartu siswa
        const cardWidth = 827;
        const cardHeight = 1239;
        const paddingTop = 100; // Ruang untuk nama sekolah
        const paddingBottom = 120; // Ruang untuk info siswa
        const qrSize = 450; // Ukuran QR Code

        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Gambar background sekolah (atas)
        ctx.fillStyle = "#27548a";
        ctx.fillRect(0, 0, cardWidth, paddingTop);
        ctx.font = "bold 40px Poppins";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SMP Anugerah Abadi", cardWidth / 2, paddingTop / 2);

        // Posisi QR Code di tengah kartu
        const qrX = (cardWidth - qrSize) / 2;
        const qrY = (cardHeight - qrSize - paddingTop - paddingBottom) / 2;
        ctx.drawImage(img, qrX, qrY + paddingTop, qrSize, qrSize);

        // Gambar background teks siswa (bawah)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, qrSize + paddingTop + qrY, cardWidth, paddingBottom);

        // border
        ctx.lineWidth = 28; // Ketebalan border
        ctx.strokeStyle = "#27548a"; // Warna border
        ctx.strokeRect(1.5, 1.5, cardWidth - 3, cardHeight - 3); // Border di seluruh kartu

        // Tambahkan nama & kelas siswa
        ctx.font = "bold 36px Poppins";
        ctx.fillStyle = "#27548a";
        ctx.fillText(siswa.nama, cardWidth / 2, qrSize + paddingTop + qrY + 50);
        ctx.fillText(
          `Kelas ${siswa.kelas}`,
          cardWidth / 2,
          qrSize + paddingTop + qrY + 100
        );

        // Konversi canvas ke gambar
        const finalImage = canvas.toDataURL("image/png");

        // Unduh gambar sebagai kartu siswa
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

  const handleBlur = () => {
    setSearchActive(false);
  };

  // Fungsi saat tombol hapus ditekan
  const handleDeleteClick = (id) => {
    setShowToast(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    setShowToast(false);

    try {
      await axios.delete(`${apiURL}/api/siswa/${deleteId}`);
      setDeleteId(null);
      setShowSuccessDelete(true);
      // Panggil ulang fetchData untuk memperbarui daftar siswa
      fetchData();

      // Aktifkan toast sukses

      // Toast otomatis hilang setelah 2 detik
      setTimeout(() => setShowSuccessDelete(false), 2000);
    } catch (err) {
      console.error("Error when deleting data:", err);
    }
  };

  const handleCancelDelete = () => {
    setShowToast(false);
    setDeleteId(null);
  };

  // Pagination logic
  const totalPage = Math.ceil(siswa.length / DATA_PER_PAGE);
  const startIdx = (page - 1) * DATA_PER_PAGE;
  const currentData = siswa.slice(startIdx, startIdx + DATA_PER_PAGE);

  // Menentukan batas halaman yang ditampilkan
  const maxPagesToShow = 4;
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPage, startPage + maxPagesToShow - 1);

  return (
    <div>
      <h2 className="title">Siswa</h2>
      <div className="flex-container">
        <div className="flex-child">
          <button className="btn-add" onClick={() => navigate("/siswa/tambah")}>
            <img src={addIcon} alt="Tambah" />
          </button>
          <div className={`search-wrapper${searchActive ? " active" : ""}`}>
            <div className="search-input-container">
              <span className="search-icon-inside">
                <img src={searchIcon} alt="Cari" />
              </span>
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder="Cari siswa..."
                onBlur={handleBlur}
              />
              <button
                className="btn-search-action"
                type="button"
                style={{ marginLeft: 8 }}
                onClick={handleSearch}
              >
                Cari
              </button>
            </div>
          </div>
        </div>
        <div className="flex-child">
          <button
            className="btn-kelas"
            onClick={async () => await getSiswaByKelas(7)}
          >
            Kelas 7
          </button>
          <button
            className="btn-kelas"
            onClick={async () => await getSiswaByKelas(8)}
          >
            Kelas 8
          </button>
          <button
            className="btn-kelas"
            onClick={async () => await getSiswaByKelas(9)}
          >
            Kelas 9
          </button>
        </div>
      </div>
      {/* Tabel Data Siswa */}
      <div className="table-container">
        <table className="siswa-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Ekstrakulikuler</th>
              <th>Kelas</th>
              <th>QR</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Tidak ada data
                </td>
              </tr>
            )}
            {currentData.map((siswa, idx) => (
              <tr key={startIdx + idx}>
                <td>{startIdx + idx + 1}</td>
                <td>{siswa.nama}</td>
                <td>{siswa.ekskul}</td>
                <td>{siswa.kelas}</td>
                <td>
                  <button
                    className="btn-qr"
                    title="Download QR"
                    onClick={() => downloadQRSiswa(siswa._id)}
                  >
                    <img src={downloadIcon} alt="Download QR" />
                  </button>
                </td>
                <td>
                  <button
                    className="btn-aksi btn-edit-siswa"
                    onClick={() => navigate(`/siswa/ubah/${siswa._id}`)}
                    title="Edit"
                  >
                    <img src={editIcon} alt="Edit" />
                  </button>
                  <button
                    className="btn-aksi btn-delete-siswa"
                    title="Hapus"
                    onClick={() => handleDeleteClick(siswa._id)}
                  >
                    <img src={deleteIcon} alt="Hapus" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SiswaTableMobile data={currentData} />
      <div className="flex-container table-footer">
        <div className="flex-child pagination-nav">
          <button
            className="btn-page"
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button
              key={i}
              className={`btn-page${page === startPage + i ? " active" : ""}`}
              onClick={() => setPage(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
          <button
            className="btn-page"
            onClick={() => setPage(page < totalPage ? page + 1 : totalPage)}
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
        <div className="flex-child export-nav">
          <button className="btn-export" onClick={onExport}>
            <img src={excelIcon} alt="export" />
            Export Excel
          </button>
        </div>
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
      {showSuccess && (
        <div className="toast-success">{location.state?.success}</div>
      )}
      {showSuccessDelete && (
        <div className="toast-success">Data Berhasil Dihapus</div>
      )}{" "}
      {showNotFound && <div className="toast-error">Data Tidak Ditemukan</div>}
      {showError && <div className="toast-error">{location.state?.error}</div>}
    </div>
  );
}
