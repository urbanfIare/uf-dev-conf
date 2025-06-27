import { Github, Linkedin, Mail, TreePine } from "lucide-react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <TreePine size={28} />
              <span className="footer-logo-text">Grove</span>
            </div>
            <p className="footer-description">
              함께 자라는 개발 숲<br />
              나무들이 모여 숲을 이루듯, 개발자들이 함께 성장하는 공간
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>탐색</h4>
              <ul>
                <li>
                  <a href="#">홈</a>
                </li>
                <li>
                  <a href="#">글 목록</a>
                </li>
                <li>
                  <a href="#">소개</a>
                </li>
                <li>
                  <a href="#">연락</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>카테고리</h4>
              <ul>
                <li>
                  <a href="#">React</a>
                </li>
                <li>
                  <a href="#">JavaScript</a>
                </li>
                <li>
                  <a href="#">Frontend</a>
                </li>
                <li>
                  <a href="#">개발 일상</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>연결</h4>
              <div className="social-links">
                <a
                  href="https://github.com"
                  className="social-link"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:contact@grove.dev"
                  className="social-link"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Grove. All rights reserved by Gyeonghwan Roh</p>
          </div>
          <div className="footer-made-with">
            <p>Made with 🌱 and ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
