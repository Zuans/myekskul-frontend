import { Link } from "react-router-dom";
import detailIcon from "../assets/icon/detail.png";

export default function SiswaTableMobile({ data }) {
  return (
    <div className="table-mobile-container">
      <table className="siswa-table-mobile">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                Tidak ada data
              </td>
            </tr>
          )}
          {data.map((siswa, idx) => (
            <tr key={idx}>
              <td>{siswa.nama}</td>
              <td>
                <Link to={`/detailsiswa/${siswa._id}`} className="btn-detail">
                  <img src={detailIcon} alt="Detail" /> Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
