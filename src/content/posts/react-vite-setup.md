---
title: "React와 Vite로 모던 개발 환경 구축하기"
date: "2024-12-19"
readTime: "8분"
tags: ["React", "Vite", "Frontend", "Setup"]
description: "Vite를 사용하여 빠르고 효율적인 React 개발 환경을 구축하는 완전한 가이드"
---

React 애플리케이션을 개발할 때 Vite를 사용하면 기존 Create React App보다 **훨씬 빠른 개발 경험**을 얻을 수 있습니다. 이 글에서는 Vite를 활용한 React 개발 환경 구축 과정을 단계별로 알아보겠습니다.

## 🚀 Vite란 무엇인가?

**Vite**(프랑스어로 "빠르다"는 뜻)는 Evan You(Vue.js 창시자)가 만든 차세대 프론트엔드 빌드 도구입니다.

### Vite의 핵심 장점

- **⚡ 빠른 개발 서버**: ES 모듈을 활용한 즉시 시작
- **🔥 Hot Module Replacement**: 실시간 코드 변경 반영
- **📦 최적화된 빌드**: Rollup 기반의 효율적인 번들링
- **🎯 TypeScript 지원**: 별도 설정 없이 즉시 사용
- **🔧 플러그인 생태계**: 풍부한 플러그인과 확장성

## 📋 사전 준비사항

시작하기 전에 다음 도구들이 설치되어 있는지 확인하세요:

```bash
# Node.js 버전 확인 (18+ 권장)
node --version

# npm 버전 확인
npm --version
```

## 🛠️ 프로젝트 생성하기

### 1. Vite + React 프로젝트 생성

```bash
# npm을 사용하는 경우
npm create vite@latest my-react-app -- --template react

# yarn을 사용하는 경우
yarn create vite my-react-app --template react

# pnpm을 사용하는 경우
pnpm create vite my-react-app --template react
```

### 2. 프로젝트 디렉토리로 이동

```bash
cd my-react-app
```

### 3. 의존성 설치

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install
```

### 4. 개발 서버 실행

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

성공적으로 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다!

## ⚙️ 기본 설정 커스터마이징

### 📁 프로젝트 구조 이해하기

생성된 프로젝트의 기본 구조는 다음과 같습니다:

```
my-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

### 🔧 Vite 설정 파일 (`vite.config.js`)

기본 설정 파일을 살펴보고 커스터마이징해보겠습니다:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 개발 서버 설정
  server: {
    port: 3000,              // 포트 변경
    host: true,              // 네트워크 접근 허용
    open: true,              // 자동으로 브라우저 열기
  },
  
  // 빌드 설정
  build: {
    outDir: 'dist',          // 빌드 결과물 디렉토리
    sourcemap: true,         // 소스맵 생성
  },
  
  // 경로 별칭 설정
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@components': new URL('./src/components', import.meta.url).pathname,
      '@utils': new URL('./src/utils', import.meta.url).pathname,
    }
  }
})
```

## 🌐 포트 변경하는 방법

### 방법 1: vite.config.js에서 설정

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1227,  // 원하는 포트 번호로 변경
  }
})
```

### 방법 2: 환경 변수 사용

```bash
# .env 파일 생성
VITE_PORT=1227
```

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT || 5173,
  }
})
```

### 방법 3: 명령어로 직접 지정

```bash
# package.json scripts 수정
{
  "scripts": {
    "dev": "vite --port 1227",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

또는 터미널에서 직접:

```bash
npm run dev -- --port 1227
```

## 🎨 추가 설정 및 최적화

### ESLint 설정

```bash
npm install -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh
```

```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

### CSS 전처리기 추가

```bash
# Sass 설치
npm install -D sass

# Styled-components 설치
npm install styled-components

# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 절대 경로 설정 활용

```javascript
// 설정 후 사용 예시
import Button from '@/components/Button'
import { formatDate } from '@/utils/date'
```

## 🚀 성능 최적화 팁

### 1. Code Splitting

```javascript
import { lazy, Suspense } from 'react'

const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <About />
    </Suspense>
  )
}
```

### 2. 환경 변수 활용

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My React App
```

```javascript
// 컴포넌트에서 사용
console.log(import.meta.env.VITE_API_URL)
```

### 3. 빌드 최적화

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'moment']
        }
      }
    }
  }
})
```

## 📊 CRA vs Vite 비교

| 항목 | Create React App | Vite |
|------|------------------|------|
| **개발 서버 시작** | 20-30초 | 1-2초 |
| **HMR 속도** | 2-5초 | 즉시 |
| **빌드 속도** | 느림 | 빠름 |
| **번들 크기** | 큼 | 작음 |
| **설정 자유도** | 제한적 | 높음 |

## 🎯 결론

Vite를 사용한 React 개발 환경은 다음과 같은 이점을 제공합니다:

- ✅ **개발 생산성 향상**: 빠른 시작과 즉시 반영되는 변경사항
- ✅ **모던 개발 경험**: ES 모듈과 최신 도구들 활용
- ✅ **유연한 설정**: 프로젝트 요구사항에 맞는 세밀한 커스터마이징
- ✅ **성능 최적화**: 효율적인 번들링과 최적화된 배포

이제 Vite와 React로 모던하고 효율적인 개발 환경을 구축할 준비가 완료되었습니다! 🚀

## 🔗 참고 자료

- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)
- [Vite + React 템플릿](https://github.com/vitejs/vite/tree/main/packages/create-vite) 