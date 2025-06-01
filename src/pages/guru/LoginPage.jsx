import React, { useState, useEffect } from "react";
import "../../style/login.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setIsLoggedIn, setUserRole, apiURL }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [successLogout, setSuccessLogout] = useState("");

  useEffect(() => {
    console.log("Location state:", location.state);
    if (location.state?.error) {
      setError(location.state.error);
      setTimeout(() => setError(""), 2000); // Hilangkan toast setelah 3 detik
    }
    if (location.state?.success) {
      setSuccess(location.state.success);
      setTimeout(() => setSuccess(""), 2000); // Hilangkan toast setelah 3 detik
    }
    if (location.state?.successLogout) {
      setSuccess(location.state.successLogout);
      setTimeout(() => setSuccessLogout(""), 2000); // Hilangkan toast setelah 3 detik
    }
  }, [location.state]);

  const handleFormLogin = async (e) => {
    try {
      e.preventDefault();
      console.log(apiURL);
      const response = await axios.post(`${apiURL}/api/guru/login`, {
        username,
        password,
      });
      setIsLoggedIn(true);
      setUserRole(localStorage.setItem("userRole", response.data.role));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/", {
        state: { success: "Sukses Login", data: response.data },
      });
    } catch (error) {
      console.log(error.data);
      const errorMessage =
        error?.data?.error || "username atau password salah!";
      navigate(`/login`, {
        state: { error: errorMessage },
      });
    }
  };

  return (
    <div className="login-container">
      {successLogout && <div className="toast-success">{successLogout}</div>}
      {success && <div className="toast-success">{success}</div>}
      {error && <div className="toast-error">{error}</div>}
      <form className="login-form" onSubmit={handleFormLogin}>
        <h2>Login</h2>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <button type="submit">Login dengan Form</button>
        <button type="button" onClick={() => navigate("/qr")}>
          Login dengan QR Code
        </button>
        <button
          type="button"
          className="daftar"
          onClick={() => navigate("/daftar")}
        >
          Daftar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
