import "../../style/adminDashboard.css";
import siswaIcon from "../../assets/icon/user.png";
import ekskulIcon from "../../assets/icon/ekstrakurikuler.png";
import guruIcon from "../../assets/icon/guru.png";
import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";

const DATA_PER_PAGE = 3;

export default function DashboardPage({ apiURL }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${apiURL}/api/admin/dashboard`);
        if (!response.ok) throw new Error("Gagal mengambil data dari API");
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiURL]);

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = type === "success" ? "toast-success" : "toast-error";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000); // Hilangkan toast setelah 3 detik
  };

  const handleApproveGuru = async (id) => {
    try {
      await axios.put(`${apiURL}/api/guru/approve/${id}`);

      showToast(" Akun guru berhasil di-approve!", "success");

      // Hapus dari daftar request setelah approve
      setDashboardData((prev) => ({
        ...prev,
        request_guru: prev.request_guru.filter((guru) => guru._id !== id),
      }));
    } catch (error) {
      showToast(" Gagal meng-approve akun guru!", "error");
    }
  };

  const handleRejectGuru = async (id) => {
    try {
      await axios.delete(`${apiURL}/api/guru/reject/${id}`);

      showToast(" Akun guru berhasil ditolak dan dihapus!", "success");

      // Hapus dari daftar request setelah reject
      setDashboardData((prev) => ({
        ...prev,
        request_guru: prev.request_guru.filter((guru) => guru._id !== id),
      }));
    } catch (error) {
      showToast(" Gagal menolak akun guru!", "error");
    }
  };

  const totalPage = Math.ceil(
    (dashboardData?.request_guru || []).length / DATA_PER_PAGE
  );

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <p>Memuat data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="title">Dashboard</h2>

      <div className="card-container">
        <div className="card">
          <img src={guruIcon} alt="guru icon" className="card-img" />
          <div className="card-text">
            <h3>Jumlah Guru :</h3>
            <p>{dashboardData.total_guru}</p>
          </div>
        </div>
        <div className="card">
          <img src={siswaIcon} alt="siswa-icon" className="card-img" />
          <div className="card-text">
            <h3>Jumlah Siswa :</h3>
            <p>{dashboardData.total_siswa}</p>
          </div>
        </div>
        <div className="card">
          <img src={ekskulIcon} alt="eksul-icon" className="card-img" />
          <div className="card-text">
            <h3>Jumlah Ekstrakurikuler :</h3>
            <p>{dashboardData.total_ekstrakurikuler}</p>
          </div>
        </div>
      </div>

      <div className="table-stat-container">
        <div className="table-wrapper table-ekskul-teratas">
          <div className="table-header">
            <h3>Ekstrakurikuler dengan Persentase Kehadiran Tertinggi</h3>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Persentase Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.ekstrakurikuler_persentase_kehadiran.map(
                (item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.persentase_kehadiran}%</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="table-wrapper table-ekskul-terbanyak">
          <h3>Ekstrakurikuler dengan Siswa Terbanyak</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jumlah Siswa</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.ekstrakurikuler_jumlah_siswa.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.jumlah_siswa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-request-container">
        <h3>Daftar Request Akun Guru</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Username</th>
              <th>Tanggal Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.request_guru.length > 0 ? (
              dashboardData.request_guru
                .slice((page - 1) * DATA_PER_PAGE, page * DATA_PER_PAGE)
                .map((request, index) => (
                  <tr key={index}>
                    <td>{(page - 1) * DATA_PER_PAGE + index + 1}</td>
                    <td>{request.nama}</td>
                    <td>{request.username}</td>
                    <td>
                      {moment(request.waktu_dibuat).format("DD-MM-YYYY HH:mm")}
                    </td>
                    <td>
                      <button
                        className="btn-approve"
                        onClick={() => handleApproveGuru(request._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectGuru(request._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  Tidak ada data akun guru yang perlu diapprove
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="ekstrakurikuler-pagination-nav">
          <button
            className="ekstrakurikuler-btn-page"
            onClick={() => onPageChange(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              className={`ekstrakurikuler-btn-page${
                page === i + 1 ? " active" : ""
              }`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="ekstrakurikuler-btn-page"
            onClick={() =>
              onPageChange(page < totalPage ? page + 1 : totalPage)
            }
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
