import '../style/header.css';
import logo from '../assets/logo.png';

function Header({onHamburgerClick, sidebarOpen}) {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header-logo" />
    <span className="header-title">SMP Anugerah Abadi</span>
  <button
        className={`hamburger${sidebarOpen ? " open" : ""}`}
        onClick={onHamburgerClick}
        aria-label="Menu"
      >
      <span />
      <span />
      <span />
    </button>
  </header>
  );
}

export default Header;
