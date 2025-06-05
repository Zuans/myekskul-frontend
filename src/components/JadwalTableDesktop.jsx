export default function JadwalTableDesktop({ data }) {
  const isAdmin = localStorage.getItem("userRole")
    ? localStorage.getItem("userRole") == "admin"
    : false;
  return (
    <div className="table-container">
      <table className="jadwal-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Kegiatan</th>
            <th>Hari</th>
            <th>Jam</th>
            {isAdmin && <th>Guru</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Tidak ada data
              </td>
            </tr>
          )}
          {data.map((item, idx) => (
            <tr key={item.id || idx}>
              <td>{idx + 1}</td>
              <td>{item.nama}</td>
              <td>{item.hari}</td>
              <td>{item.jam}</td>
              {isAdmin && <td>{item.nama_guru}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
