import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/login.css";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username tidak boleh kosong.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    // Simulasi proses pendaftaran
    try {
      const response = await axios.post("http://localhost:7878/api/guru", {
        username, // Menambahkan username ke request
        nama: teacherName,
        password,
      });
      navigate("/login", {
        state: { success: "Sukses Daftar!" },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Gagal menambahkan siswa!";
      navigate(`/login`, {
        state: { error: errorMessage },
      });
    }

    setSuccess("Pendaftaran berhasil! Silakan lanjut ke halaman login.");
    setUsername("");
    setTeacherName("");
    setPassword("");
    setConfirmPassword("");

    // Hapus toast setelah beberapa detik
    setTimeout(() => setSuccess(""), 2000);
    setTimeout(() => setError(""), 2000);
  };

  return (
    <div className="login-container">
      {/* Toast Notifications */}
      {success && <div className="toast-success">{success}</div>}
      {error && <div className="toast-error">{error}</div>}

      <form className="login-form" onSubmit={handleRegister}>
        <h2>Daftar Guru</h2>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="teacherName">Nama Guru:</label>
        <input
          type="text"
          id="teacherName"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Sembunyikan" : "Tampilkan"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <label htmlFor="confirmPassword">Konfirmasi Password:</label>
        <input
          type={showPassword ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Daftar Sekarang</button>
      </form>
    </div>
  );
};

export default RegisterPage;
