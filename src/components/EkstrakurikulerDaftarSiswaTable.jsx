import deleteIcon from "../assets/icon/delete.png";

export default function EkstrakurikulerDaftarSiswaTable({ data, onDelete }) {
  return (
    <div className="table-container">
      <table className="siswa-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Tidak ada data siswa
              </td>
            </tr>
          )}
          {data.map((siswa, idx) => (
            <tr key={siswa.id}>
              <td>{idx + 1}</td>
              <td>{siswa.nama}</td>
              <td>{siswa.kelas}</td>
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
