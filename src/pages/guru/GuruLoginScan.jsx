import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function GuruLoginScan({ setIsLoggedIn, setUserRole }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState("");
  const [showToast, setShowToast] = useState(false);
  const html5QrCodeRef = useRef(null);
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

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
              setScanResult(decodedText);
              console.log(id);
              try {
                const response = await axios.post(
                  `http://localhost:7878/api/guru/login/qr`,
                  {
                    userId: decodedText,
                  }
                );
                setIsLoggedIn(true);
                setUserRole(localStorage.setItem("userRole", response.data.role));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("userRole", response.data.role);
                localStorage.setItem("userData", JSON.stringify(response.data));
                navigate("/", {
                  state: { success: "Sukses Login", data: response.data },
                });
              } catch (error) {
                console.error(error);
                const errorMessage =
                  error.response?.data?.message || "Gagal login";
                navigate(`/login`, {
                  state: { error: errorMessage },
                });
              }

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
        flexDirection: "column",
      }}
    >
      <h2 className="title">Scan Login</h2>
      <div
        id="reader"
        ref={scannerRef}
        style={{
          width: "100%",
          maxWidth: 350,
          minHeight: 250,
          margin: "16px auto",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      />
      <div style={{ textAlign: "center", marginTop: 16 }}>
        {scanResult ? (
          <span>Scan Berhasil</span>
        ) : (
          <span>Silakan arahkan kamera ke QR</span>
        )}
      </div>
      <Link to="/login">
        <button
          className="btn-kembali-primary"
          onClick={() => navigate("/login")}
          style={{ marginTop: 16 }}
        >
          Kembali
        </button>
      </Link>
    </div>
  );
}
