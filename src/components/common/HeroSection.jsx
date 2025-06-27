import { TreePine, Users, Heart, Lightbulb } from "lucide-react";
import { useVisitorCount } from "../../hooks/useVisitorCount";
import "./HeroSection.css";

function HeroSection() {
  // 방문자 수 훅 사용
  const { visitorCount, todayVisitors, isNewVisitor } = useVisitorCount();

  // 블로그 시작 날짜 (오늘 날짜)
  const BLOG_START_DATE = new Date("2025-06-27");
  const DEV_START_DATE = new Date("2021-01-01"); // 개발 시작 날짜 (2021년 1월)

  // 현재 날짜
  const today = new Date();

  // 개발 경력 계산 (년/월)
  const devYears = today.getFullYear() - DEV_START_DATE.getFullYear();
  const devMonths = today.getMonth() - DEV_START_DATE.getMonth();

  // 정확한 년/월 계산
  let totalYears = devYears;
  let totalMonths = devMonths;

  if (totalMonths < 0) {
    totalYears -= 1;
    totalMonths += 12;
  }

  // 경력 표시 형태
  const experienceText =
    totalMonths === 0 ? `${totalYears}y` : `${totalYears}y ${totalMonths}m`;

  // 블로그 운영 일자 계산
  const timeDiff = today.getTime() - BLOG_START_DATE.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // 작성된 글 수 (임시)
  const postsCount = 2;

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-avatar">
            <span className="avatar-emoji">🌳</span>
          </div>

          <h1 className="hero-title">
            안녕하세요, 노력하는 개발자 <strong>Grove</strong>입니다
          </h1>

          <p className="hero-subtitle">
            4년차 개발자로 금융권 SI 프로젝트를 경험하며 성장해왔습니다.
            <br />
            나무와 같이 꾸준히 성장하고 결실을 맺고 싶은 개발자입니다.
          </p>

          {/* 새 방문자 환영 메시지 */}
          {isNewVisitor && (
            <div className="welcome-message">
              🎉 Grove의 블로그에 처음 오신 것을 환영합니다!
            </div>
          )}

          <div className="hero-values">
            <div
              className="value-item"
              data-tooltip="나무처럼 뿌리깊게 차근차근 성장하는 개발자"
            >
              🌱 <span>꾸준한 성장</span>
            </div>
            <div
              className="value-item"
              data-tooltip="혼자가 아닌 함께 자라는 숲"
            >
              🤝 <span>함께하는 여정</span>
            </div>
            <div
              className="value-item"
              data-tooltip="다른 사람들이 쉬어갈 수 있는 그늘"
            >
              🏠 <span>따뜻한 쉼터</span>
            </div>
            <div
              className="value-item"
              data-tooltip="서로 도우며 성장하는 개발 생태계"
            >
              💚 <span>따뜻한 공동체</span>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{experienceText}</span>
            <span className="stat-label">개발 경력</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{daysDiff}</span>
            <span className="stat-label">블로그 운영</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{postsCount}</span>
            <span className="stat-label">작성한 글</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{visitorCount.toLocaleString()}</span>
            <span className="stat-label">총 방문자</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{todayVisitors}</span>
            <span className="stat-label">오늘 방문자</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
