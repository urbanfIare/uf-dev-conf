# 🌳 Grove - 함께 자라는 개발 숲

> **나무와 같이 성장하고 결실을 맺고 싶은 사람, 주변 사람들이 힘들 때 쉬어갈 수 있는 사람**

Grove는 개발자 노경환의 개인 기술 블로그입니다. 작은 숲(Grove)이라는 이름처럼, 개발 지식을 공유하고 함께 성장하는 공간을 만들고자 합니다.

![Grove Blog Screenshot](https://via.placeholder.com/800x400/2d5a27/ffffff?text=Grove+Blog+Preview)

## ✨ 주요 특징

- 🎨 **노션 스타일 UI**: 깔끔하고 직관적인 디자인
- 🌙 **다크/라이트 테마**: 사용자 선호도에 따른 테마 전환
- 📱 **완전 반응형**: 모든 디바이스에서 최적화된 경험
- 📝 **마크다운 지원**: 코드 하이라이팅과 함께하는 풍부한 콘텐츠
- ⚡ **빠른 성능**: Vite 기반의 최적화된 빌드
- 🌱 **Grove 브랜딩**: 자연 친화적 그린 컬러 테마

## 🚀 기술 스택

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Styling**: CSS Variables + 모듈화된 CSS
- **Markdown**: react-markdown + react-syntax-highlighter
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel (예정)

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/grove-blog.git
cd grove-blog

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Header, Footer, HeroSection)
│   └── blog/           # 블로그 관련 컴포넌트 (PostList, BlogPost)
├── content/            # 마크다운 콘텐츠
│   └── posts/          # 블로그 포스트들
├── utils/              # 유틸리티 함수들
├── hooks/              # 커스텀 React 훅들
├── lib/                # 라이브러리 설정
└── assets/             # 정적 자산들
```

## 📝 새 포스트 작성하기

1. `src/content/posts/` 디렉토리에 새 `.md` 파일 생성
2. Front Matter 형식으로 메타데이터 작성:

```markdown
---
title: "포스트 제목"
date: "2024-01-01"
excerpt: "포스트 요약"
tags: ["React", "JavaScript", "Web"]
category: "tech"
---

# 포스트 내용

여기에 마크다운 형식으로 내용을 작성하세요.
```

3. 개발 서버에서 자동으로 감지되어 포스트 목록에 추가됩니다.

## 🎨 커스터마이징

### 테마 색상 변경
`src/App.css`의 CSS 변수를 수정하여 브랜드 컬러를 변경할 수 있습니다:

```css
:root {
  --color-primary: #2d5a27;      /* Grove 그린 */
  --color-primary-hover: #1d4ed8; /* 호버 색상 */
  /* ... 기타 변수들 */
}
```

### 개인 정보 수정
`src/components/common/HeroSection.jsx`와 `src/components/common/Footer.jsx`에서 개인 정보를 수정할 수 있습니다.

## 🌟 주요 기능

### 🏠 히어로 섹션
- 개발자 소개 및 아바타
- 핵심 가치 카드 (성장, 협력, 쉼터, 공동체)
- 동적 통계 (경력, 포스트 수, 운영 일수)

### 📋 블로그 포스트
- 마크다운 렌더링
- 코드 블록 문법 하이라이팅
- 태그 기반 분류
- 읽기 시간 계산
- 반응형 디자인

### 🎛️ 테마 시스템
- 라이트/다크 모드 지원
- 사용자 설정 로컬 저장소 저장
- 시스템 설정 자동 감지

## 📊 성능 최적화

- **Code Splitting**: 컴포넌트별 지연 로딩
- **Image Optimization**: 최적화된 이미지 로딩
- **CSS Optimization**: 모듈화된 CSS로 번들 크기 최소화
- **Tree Shaking**: 사용하지 않는 코드 제거

## 🚀 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### GitHub Pages 배포
```bash
# GitHub Pages용 빌드
npm run build

# dist 폴더를 GitHub Pages에 배포
```

## 🤝 기여하기

Grove 블로그 프로젝트에 기여해주셔서 감사합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

**노경환** - *4년차 개발자*

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 💼 LinkedIn: [노경환](https://linkedin.com/in/yourusername)

## 🙏 감사의 말

- [React](https://reactjs.org/) - UI 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 도구
- [Lucide](https://lucide.dev/) - 아이콘 라이브러리
- [react-markdown](https://github.com/remarkjs/react-markdown) - 마크다운 렌더링

---

<div align="center">

**🌳 Grove에서 함께 성장해요! 🌳**

Made with 🌱 and ❤️ by 노경환

</div>
