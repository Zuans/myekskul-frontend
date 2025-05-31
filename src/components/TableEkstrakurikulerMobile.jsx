import detailIcon from "../assets/icon/detail.png";
import excelIcon from "../assets/icon/excel.png";

export default function TableEkstrakurikulerMobile({
  data,
  page,
  setPage,
  onDetail,
  onExport,
}) {
  const DATA_PER_PAGE = 5;
  const totalPage = Math.ceil(data.length / DATA_PER_PAGE);
  const startIdx = (page - 1) * DATA_PER_PAGE;
  const currentData = data.slice(startIdx, startIdx + DATA_PER_PAGE);

  return (
    <div className="ekstrakurikuler-table-mobile-container-mobile">
      <table className="ekstrakurikuler-table-mobile-mobile">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((ekskul) => (
            <tr key={ekskul.id}>
              <td>{ekskul.nama}</td>
              <td>
                <button
                  className="ekstrakurikuler-btn-aksi-mobile ekstrakurikuler-btn-detail-mobile"
                  title="Lihat Detail"
                  onClick={() => onDetail && onDetail(ekskul._id)}
                >
                  <img src={detailIcon} alt="Detail" /> Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="ekstrakurikuler-table-footer-container-mobile">
        <div className="ekstrakurikuler-pagination-nav-mobile">
          <button
            className="ekstrakurikuler-btn-page-mobile"
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              className={`ekstrakurikuler-btn-page-mobile${
                page === i + 1 ? " active" : ""
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="ekstrakurikuler-btn-page-mobile"
            onClick={() => setPage(page < totalPage ? page + 1 : totalPage)}
            disabled={page === totalPage}
          >
            {">"}
          </button>
        </div>
        <div className="ekstrakurikuler-export-nav-mobile">
          <button
            className="ekstrakurikuler-btn-export-mobile"
            onClick={onExport}
          >
            <img src={excelIcon} alt="export" /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
