import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "light" : "dark"
    );
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🌳</span>
          <span className="logo-text">Grove</span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <a href="#" className="nav-link">
            홈
          </a>
          <a href="#" className="nav-link">
            기술
          </a>
          <a href="#" className="nav-link">
            일상
          </a>
          <a href="#" className="nav-link">
            소개
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="테마 변경"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="메뉴"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
