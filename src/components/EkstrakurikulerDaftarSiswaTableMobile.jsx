import deleteIcon from "../assets/icon/delete.png";

export default function EkstrakurikulerDaftarSiswaTableMobile({
  data,
  onDelete,
}) {
  return (
    <div className="siswa-table-mobile">
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              Nama & Kelas
            </th>
            <th
              style={{
                background: "var(--primary-blue, #27548a)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                Tidak ada data siswa
              </td>
            </tr>
          )}
          {data.map((siswa, idx) => (
            <tr
              key={siswa.id}
              className={(idx + 1) % 2 === 0 ? "row-genap" : ""}
            >
              <td>
                <div className="siswa-table-mobile-nama">{siswa.nama}</div>
                <div className="siswa-table-mobile-kelas">{siswa.kelas}</div>
              </td>
              <td>
                <button
                  className="btn-delete-daftar-siswa"
                  title="Hapus"
                  onClick={() => onDelete && onDelete(siswa._id)}
                >
                  <img src={deleteIcon} alt="Hapus" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
