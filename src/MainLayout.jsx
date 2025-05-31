import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function MainLayout({ children, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Cek jika user di halaman login

  return (
    <div className="app">
      {!isLoginPage && (
        <>
          <Header
            onHamburgerClick={() => setSidebarOpen((open) => !open)}
            sidebarOpen={sidebarOpen}
          />
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
        </>
      )}
      <div className="content" style={{ flex: 1, padding: 32 }}>
        {children}
      </div>
    </div>
  );
}
