import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/tambahSiswa.css";
import axios from "axios";

export default function TambahSiswa({ apiURL }) {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [file, setFile] = useState(null); // State untuk file upload
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = async () => {
      try {
        const response = await axios.post(`${apiURL}/api/siswa`, {
          nama,
          kelas,
        });
        console.log("Data berhasil dikirim:", response.data);
        navigate("/siswa", {
          state: { success: "Data siswa berhasil ditambahkan!" },
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Gagal menambahkan siswa!";
        console.log(errorMessage);
        navigate(`/siswa`, {
          state: { error: errorMessage },
        });
      }
    };

    postData();
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/siswa/template`, {
        responseType: "blob", // Pastikan respons berupa file
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TemplateSiswa.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Template berhasil diunduh");
    } catch (error) {
      console.error("Gagal mengunduh template:", error);
      alert("Terjadi kesalahan saat mengunduh template.");
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Silakan pilih file spreadsheet terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${apiURL}/api/siswa/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("File berhasil diunggah:", response.data);
      navigate("/siswa", {
        state: { success: "Sukses Menambahkan Data Siswa!" },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Gagal mengunggah file!";
      setError(errorMessage);

      // Navigasi ke /siswa dengan state error
      navigate("/siswa", { state: { error: errorMessage } });
    }
  };
  return (
    <div>
      <h2 className="title">Tambah Siswa</h2>
      <form className="form-tambah-siswa" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Masukkan nama siswa"
          />
        </div>
        <div className="form-group">
          <label htmlFor="kelas">Kelas</label>
          <input
            id="kelas"
            type="text"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            required
            placeholder="Masukkan kelas"
          />
        </div>
        <button className="btn-tambah" type="submit">
          Tambahkan
        </button>
      </form>

      {/* Form Upload Siswa */}
      <form className="form-upload-siswa" onSubmit={handleUploadSubmit}>
        <h3 className="title">Upload Siswa</h3>
        <button
          className="btn-download"
          type="button"
          onClick={handleDownloadTemplate}
        >
          Download Template
        </button>
        <div className="form-group">
          <label htmlFor="file">Unggah File Spreadsheet</label>
          <input
            id="file"
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button className="btn-upload" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
}
