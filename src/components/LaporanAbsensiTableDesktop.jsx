import excelIcon from "../assets/icon/excel.png";
import detailIcon from "../assets/icon/detail.png";

export default function LaporanAbsensiTableDesktop({
  data,
  onDetail,
  page,
  totalPage,
  onPageChange,
  onExport,
}) {
  return (
    <div className="laporan-absensi-table-container">
      <table className="laporan-absensi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Kegiatan</th>
            <th>Hari</th>
            <th>Jam</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Tidak ada data
              </td>
            </tr>
          )}
          {data.map((ekstrakurikuler, idx) => (
            <tr
              key={ekstrakurikuler.id || idx}
              className={idx % 2 === 1 ? "row-genap" : ""}
            >
              <td>{(page - 1) * data.length + idx + 1}</td>
              <td>{ekstrakurikuler.nama}</td>
              <td>{ekstrakurikuler.hari}</td>
              <td>{ekstrakurikuler.jam}</td>
              <td>
                <button
                  className="btn-detail"
                  style={{
                    background: "var(--primary-blue, #27548a)",
                    display: "flex",
                    gap: "8px",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    onDetail &&
                    onDetail(ekstrakurikuler._id, ekstrakurikuler.nama)
                  }
                >
                  <img src={detailIcon} alt="Cari" /> Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="ekstrakurikuler-table-footer-container">
        <div className="ekstrakurikuler-pagination-nav">
          <button
            className="ekstrakurikuler-btn-page"
            onClick={() => onPageChange(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>

          {[...Array(totalPage)].map((_, i) => {
            if (i + 1 === page || i + 1 === page - 1 || i + 1 === page + 1) {
              return (
                <button
                  key={i}
                  className={`ekstrakurikuler-btn-page${
                    page === i + 1 ? " active" : ""
                  }`}
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </button>
              );
            }
            return null;
          })}

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

        <div className="laporan-absensi-export-nav-mobile">
          <button
            className="laporan-absensi-btn-export-mobile"
            onClick={onExport}
          >
            <img src={excelIcon} alt="export" /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
