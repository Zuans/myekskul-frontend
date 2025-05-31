import { useNavigate } from "react-router-dom";
import editIcon from "../assets/icon/edit.png";
import deleteIcon from "../assets/icon/delete.png";
import excelIcon from "../assets/icon/excel.png";
import userIcon from "../assets/icon/user.png";
import "../style/ekstrakurikuler.css";

const DATA_PER_PAGE = 5;

export default function TableEkstrakurikuler({
  data,
  page,
  onPageChange,
  onEdit,
  onDelete,
  onExport,
}) {
  const navigate = useNavigate();

  const totalPage = Math.ceil(data.length / DATA_PER_PAGE);
  const startIdx = (page - 1) * DATA_PER_PAGE;
  const currentData = data.slice(startIdx, startIdx + DATA_PER_PAGE);

  return (
    <>
      <div className="ekstrakurikuler-table-container">
        <table className="ekstrakurikuler-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Kegiatan</th>
              <th>Hari</th>
              <th>Jam</th>
              <th>Siswa</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ekskul, idx) => (
              <tr key={ekskul.id}>
                <td>{startIdx + idx + 1}</td>
                <td>{ekskul.nama}</td>
                <td>{ekskul.hari}</td>
                <td>{ekskul.jam}</td>
                <td>
                  <button
                    className="ekstrakurikuler-btn-aksi ekstrakurikuler-btn-user"
                    title="Kelola Siswa"
                    onClick={() =>
                      navigate(`/ekstrakurikuler/siswa/${ekskul._id}`)
                    }
                    style={{ marginRight: 8 }}
                  >
                    <img src={userIcon} alt="Siswa" />
                    {ekskul.siswa_terdaftar ? ekskul.siswa_terdaftar.length : 0}
                  </button>
                </td>
                <td>
                  <button
                    className="ekstrakurikuler-btn-aksi ekstrakurikuler-btn-edit"
                    title="Edit"
                    onClick={() => onEdit && onEdit(ekskul._id)}
                  >
                    <img src={editIcon} alt="Edit" />
                  </button>
                  <button
                    className="ekstrakurikuler-btn-aksi ekstrakurikuler-btn-delete"
                    title="Hapus"
                    onClick={() => onDelete && onDelete(ekskul._id)}
                  >
                    <img src={deleteIcon} alt="Hapus" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination & Export */}
      <div className="ekstrakurikuler-table-footer-container">
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
        <div className="ekstrakurikuler-export-nav">
          <button className="ekstrakurikuler-btn-export" onClick={onExport}>
            <img src={excelIcon} alt="export" /> Export Excel
          </button>
        </div>
      </div>
    </>
  );
}
