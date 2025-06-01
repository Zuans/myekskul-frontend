import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../style/dashboard.css";
import scanIcon from "../../assets/icon/scan.png";
import manualIcon from "../../assets/icon/edit.png";
import axios from "axios";

export default function DashboardPage({ apiURL }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(!!location.state?.success);
  const [nama, setNama] = useState();
  const [guruId, setGuruId] = useState();
  const [jadwal, setJadwal] = useState();
  const [ekstrakurikuler, setEkstrakurikuler] = useState({});
  const [absensiTerakhir, setAbsensiTerakhir] = useState();
  const [persentaseBulan, setPersentaseBulan] = useState();
  const [persentaseSemester, setPersentaseSemester] = useState();
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(location.state.success);
      setTimeout(() => setShowSuccess(""), 2000); // Hilangkan toast setelah 3 detik
    }

    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      setNama(userData.nama);
      setGuruId(userData._id);
    }
  }, [location.state, setNama, setGuruId]);
  const fetchData = async () => {
    try {
      const { _id } = JSON.parse(localStorage.getItem("userData"));
      const response = await axios.get(
        `${apiURL}/api/absensi/absenCepat/${_id}`
      );
      setEkstrakurikuler(response.data);
      const responseJadwalNanti = await axios.get(
        `${apiURL}/api/guru/jadwalNanti/${_id}`
      );
      const dataJadwal = responseJadwalNanti.data.schedules.map((data) => {
        return [
          {
            nama: data.nama,
            hari: data.hari,
            tanggal: data.nextDate,
          },
          {
            nama: data.nama,
            hari: data.hari,
            tanggal: data.nextWeekDate,
          },
        ];
      });
      setJadwal(dataJadwal);

      const responseAbsensiTerakhir = await axios.get(
        `${apiURL}/api/absensi/absensiTerakhir/${_id}`
      );
      const { absensi } = responseAbsensiTerakhir.data;
      setAbsensiTerakhir(absensi);
      const reponsePersentaseBulan = await axios.get(
        `${apiURL}/api/absensi/persentaseBulan/${_id}`
      );

      setPersentaseBulan(reponsePersentaseBulan.data);

      const reponsePersentaseSemester = await axios.get(
        `${apiURL}/api/absensi/persentaseSemester/${_id}`
      );

      setPersentaseSemester(reponsePersentaseSemester.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="title">Selamat Datang {nama}</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card card-1">
          <h2 className="card-title">Absen Cepat</h2>
          <span className="time">
            {ekstrakurikuler.nama} {todayFormatted}
          </span>
          <div className="btn-container">
            <button
              className="btn-scan"
              onClick={() =>
                navigate(`/ekstrakurikuler/siswa/scan/${ekstrakurikuler._id}`)
              }
            >
              <img src={scanIcon} alt="Scan" className="btn-icon" />
              Scan Sekarang
            </button>
            <button
              className="btn-manual"
              onClick={() =>
                navigate(
                  `laporanAbsensi/detail/${todayFormatted}?ekstrakurikuler=${ekstrakurikuler._id}`
                )
              }
            >
              <img src={manualIcon} alt="Manual" className="btn-icon" />
              Absensi Manual
            </button>
          </div>
        </div>
        <div className="dashboard-card card-2">
          <h2 className="card-title">Jadwal Nanti</h2>
          <ul className="jadwal-list">
            {jadwal?.flat().map((schedule, index) => (
              <li key={index}>
                <span className="jadwal-tanggal">{schedule.tanggal}</span>
                <span className="jadwal-nama">{schedule.nama}</span>
                <span className="jadwal-hari">{schedule.hari}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card card-3">
          <h2 className="card-title">Riwayat Absensi Terakhir</h2>
          <ul className="riwayat-list">
            {absensiTerakhir?.map((item, index) => (
              <li key={index}>
                <span className="riwayat-nama">{item.nama_siswa}</span>
                <span className="riwayat-ekskul">
                  {item.nama_ekstrakurikuler}
                </span>
                <span className="riwayat-jam">{item.waktu_scan}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card card-4">
          <h2 className="card-title">Persentase Kehadiran Bulan Ini</h2>
          <ul className="progress-list">
            <li>
              <span className="progress-nama">{ekstrakurikuler.nama}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      persentaseBulan
                        ? ` ${persentaseBulan.persentase_kehadiran}%`
                        : "0"
                    }`,
                  }}
                >
                  {persentaseBulan
                    ? `${persentaseBulan.persentase_kehadiran}%`
                    : "0%"}
                </div>
              </div>
            </li>
            <h2 className="card-title">Persentase Kehadiran Semester Ini</h2>
            <li>
              <span className="progress-nama">{ekstrakurikuler.nama}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      persentaseSemester
                        ? ` ${persentaseSemester.persentase_kehadiran}%`
                        : "0"
                    }`,
                  }}
                >
                  {persentaseSemester
                    ? `${persentaseSemester.persentase_kehadiran}%`
                    : "0%"}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {showSuccess && (
        <div className="toast-success">{location.state?.success}</div>
      )}
    </div>
  );
}
