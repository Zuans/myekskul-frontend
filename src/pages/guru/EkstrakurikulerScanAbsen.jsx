import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function EkstrakurikulerScanAbsen({ apiURL }) {
  const { idEkstrakurikuler } = useParams();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState("");
  const [showToast, setShowToast] = useState(false);
  const html5QrCodeRef = useRef(null);
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const [ekstrakurikuler, setEkstrakurikuler] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/ekstrakurikuler/id/${idEkstrakurikuler}` // Ganti dengan ID guru yang sesuai
      );
      setEkstrakurikuler(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toast auto-hide effect
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  // QR Scanner effect
  useEffect(() => {
    if (!scannerRef.current) return;

    html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        html5QrCodeRef.current
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 200 },
            async (decodedText) => {
              console.log(decodedText);
              try {
                const response = await axios.post(
                  `${apiURL}/api/absensi/${decodedText}/${idEkstrakurikuler}`
                );

                // Navigasi ke halaman ekstrakurikuler
                navigate(`/ekstrakurikuler/siswa/${idEkstrakurikuler}`, {
                  state: { success: "Absensi Siswa Sukses" },
                });
              } catch (error) {
                console.error(error);

                // Gunakan pesan error dari backend jika tersedia
                const errorMessage =
                  error.response?.data?.message || "Absen Siswa Gagal";
                navigate(`/ekstrakurikuler/siswa/${idEkstrakurikuler}`, {
                  state: { error: errorMessage },
                });
                setShowToast(true);
                if (isRunningRef.current) {
                  html5QrCodeRef.current.stop().catch(() => {});
                  isRunningRef.current = false;
                }
              }
              // api requset
              if (isRunningRef.current) {
                html5QrCodeRef.current.stop().catch(() => {});
                isRunningRef.current = false;
              }
            },
            () => {} // ignore scan errors
          )
          .then(() => {
            isRunningRef.current = true;
          })
          .catch(() => {});
      }
    });

    return () => {
      if (html5QrCodeRef.current) {
        if (isRunningRef.current) {
          html5QrCodeRef.current
            .stop()
            .then(() => {
              if (html5QrCodeRef.current) {
                html5QrCodeRef.current.clear();
              }
              isRunningRef.current = false;
            })
            .catch((err) => console.error("Gagal menghentikan scanner:", err));
        }
      }
    };
  }, []);

  return (
    <div>
      <h2 className="title">Scan QR Siswa - Absensi {ekstrakurikuler?.nama}</h2>
      {/* Preview kamera */}
      <div style={{ maxWidth: 350, margin: "16px auto" }}>
        <div
          id="reader"
          ref={scannerRef}
          style={{
            width: "100%",
            minHeight: 250,
            margin: "0 auto",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        />
      </div>
      {/* Hasil scan */}
      <div style={{ maxWidth: 350, margin: "0 auto" }}>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          {scanResult ? (
            <span>Scan Berhasil</span>
          ) : (
            <span>Silakan arahkan kamera ke QR siswa</span>
          )}
        </div>
      </div>
      {/* Tombol kembali */}
      <button className="btn-kembali-primary" onClick={() => navigate(-1)}>
        Kembali
      </button>
      {/* Toast sukses */}
      {showToast && (
        <div
          className="toast-success"
          style={{
            background: "#217346",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textAlign: "center",
            margin: "16px auto",
            maxWidth: 300,
            fontWeight: 600,
          }}
        >
          Scan berhasil, Siswa Berhasil ditambahkan!
        </div>
      )}
    </div>
  );
}
