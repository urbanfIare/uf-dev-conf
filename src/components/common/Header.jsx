import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import "./Header.css";

function Header({ isDarkMode, onToggleDarkMode, onLogoClick, showBackButton }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div
          className="logo"
          onClick={onLogoClick}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">🌳</span>
          <span className="logo-text">Grove</span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            홈
          </Link>
          <Link
            to="/posts"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            전체 글
          </Link>
          <Link
            to="/category/dev"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            기술
          </Link>
          <Link
            to="/category/life"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            일상
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            소개
          </Link>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={onToggleDarkMode}
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
