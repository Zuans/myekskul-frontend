export default function JadwalTableMobile({ data }) {
  return (
    <div className="jadwal-table-mobile">
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Kegiatan</th>
            <th>Hari</th>
            <th>Jam</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                Tidak ada data
              </td>
            </tr>
          )}
          {data.map((item, idx) => (
            <tr key={item.id || idx}>
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
