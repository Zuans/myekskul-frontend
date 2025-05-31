// layouts/AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f4f4",
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
