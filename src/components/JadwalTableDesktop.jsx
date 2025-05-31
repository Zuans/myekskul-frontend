export default function JadwalTableDesktop({ data }) {
  return (
    <div className="table-container">
      <table className="jadwal-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Kegiatan</th>
            <th>Hari</th>
            <th>Jam</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
