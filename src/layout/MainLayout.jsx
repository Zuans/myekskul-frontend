// layouts/MainLayout.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app">
      <Header
        onHamburgerClick={() => setSidebarOpen((open) => !open)}
        sidebarOpen={sidebarOpen}
      />
      <div className="main">
        <Sidebar show={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.2)",
              zIndex: 99,
              display: "block",
            }}
          />
        )}
        <div className="content" style={{ flex: 1, padding: 32 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
