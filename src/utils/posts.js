// 마크다운 파일에서 포스트 데이터를 추출하는 유틸리티

/**
 * Front matter를 파싱하는 함수
 * @param {string} content - 마크다운 파일 전체 내용
 * @returns {Object} { metadata, content } 객체
 */
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { metadata: {}, content };
  }
  
  const [, frontMatter, markdownContent] = match;
  const metadata = {};
  
  // YAML-like parsing (간단한 버전)
  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // 따옴표 제거
      value = value.replace(/^["']|["']$/g, '');
      
      // 배열 처리 (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => 
          item.trim().replace(/^["']|["']$/g, '')
        );
      }
      
      metadata[key] = value;
    }
  });
  
  return { metadata, content: markdownContent };
}

/**
 * 포스트 ID로부터 마크다운 파일 경로를 생성
 * @param {string} postId - 포스트 ID
 * @returns {string} 파일 경로
 */
function getPostFilePath(postId) {
  return `/src/content/posts/${postId}.md`;
}

/**
 * 마크다운 내용에서 요약문 생성
 * @param {string} content - 마크다운 내용
 * @param {number} maxLength - 최대 길이
 * @returns {string} 요약문
 */
function generateExcerpt(content, maxLength = 150) {
  // 마크다운 헤더와 코드 블록 제거
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // 헤더 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/`[^`]*`/g, '') // 인라인 코드 제거
    .replace(/\*\*([^*]*)\*\*/g, '$1') // 볼드 제거
    .replace(/\*([^*]*)\*/g, '$1') // 이탤릭 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 제거
    .replace(/\n+/g, ' ') // 개행을 공백으로
    .trim();
    
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength) + '...';
}

/**
 * 모든 포스트 데이터를 가져오는 함수
 * @returns {Array} 포스트 배열
 */
export function getAllPosts() {
  const posts = [
    {
      id: 'react-vite-setup',
      slug: 'react-vite-setup',
      title: 'React와 Vite로 모던 개발 환경 구축하기',
      date: '2024-12-19',
      readTime: '8분',
      tags: ['React', 'Vite', 'Frontend', 'Setup'],
      description: 'Vite를 사용하여 빠르고 효율적인 React 개발 환경을 구축하는 완전한 가이드',
      excerpt: 'React 애플리케이션을 개발할 때 Vite를 사용하면 기존 Create React App보다 훨씬 빠른 개발 경험을 얻을 수 있습니다. 이 글에서는 Vite를 활용한 React 개발 환경 구축 과정을 단계별로...'
    },
    {
      id: 'typescript-alternative',
      slug: 'typescript-alternative', 
      title: 'TypeScript 없이도 견고한 React 코드 작성하기',
      date: '2024-12-18',
      readTime: '7분',
      tags: ['JavaScript', 'React', 'Best Practices', 'JSDoc'],
      description: 'TypeScript를 사용하지 않더라도 PropTypes와 JSDoc을 활용하여 견고한 React 코드를 작성하는 방법',
      excerpt: 'TypeScript의 인기가 높아지고 있지만, 모든 프로젝트에서 TypeScript를 도입할 수 있는 것은 아닙니다. 하지만 JavaScript만으로도 타입 안정성을 높이고 견고한 코드를 작성할 수 있는...'
    }
  ];
  
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * 특정 포스트의 전체 내용을 가져오는 함수
 * @param {string} postId - 포스트 ID
 * @returns {Object|null} 포스트 객체 또는 null
 */
export async function getPostBySlug(postId) {
  try {
    const posts = getAllPosts();
    const post = posts.find(p => p.slug === postId);
    
    if (!post) {
      return null;
    }
    
    const markdownContent = await getMarkdownContent(postId);
    
    return {
      ...post,
      content: markdownContent
    };
  } catch (error) {
    console.error('포스트 로딩 실패:', error);
    return null;
  }
}

/**
 * 마크다운 내용을 가져오는 함수
 * @param {string} postId - 포스트 ID
 * @returns {string} 마크다운 내용
 */
async function getMarkdownContent(postId) {
  const contentMap = {
    'react-vite-setup': `# React와 Vite로 모던 개발 환경 구축하기

React 애플리케이션을 개발할 때 Vite를 사용하면 기존 Create React App보다 **훨씬 빠른 개발 경험**을 얻을 수 있습니다.

## 🚀 Vite란 무엇인가?

**Vite**(프랑스어로 "빠르다"는 뜻)는 Evan You(Vue.js 창시자)가 만든 차세대 프론트엔드 빌드 도구입니다.

### Vite의 핵심 장점

- **⚡ 빠른 개발 서버**: ES 모듈을 활용한 즉시 시작
- **🔥 Hot Module Replacement**: 실시간 코드 변경 반영
- **📦 최적화된 빌드**: Rollup 기반의 효율적인 번들링

## 📋 프로젝트 생성하기

### 1. Vite React 프로젝트 생성

\`\`\`bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
\`\`\`

### 2. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

기본적으로 http://localhost:5173 에서 애플리케이션이 실행됩니다.

## 🌐 포트 변경하는 방법

### 방법 1: vite.config.js에서 설정

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1227,  // 원하는 포트 번호로 변경
    host: true,  // 네트워크에서 접근 가능하도록 설정
    open: true   // 서버 시작 시 브라우저 자동 열기
  }
})
\`\`\`

### 방법 2: package.json scripts 수정

\`\`\`json
{
  "scripts": {
    "dev": "vite --port 1227",
    "build": "vite build",
    "preview": "vite preview"
  }
}
\`\`\`

## 🔧 추가 설정 팁

### 환경 변수 설정

\`\`\`.env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Grove Blog
\`\`\`

### CSS 전처리기 설정

\`\`\`bash
# Sass 설치
npm install -D sass

# Styled-components 설치  
npm install styled-components
\`\`\`

이렇게 간단한 설정으로 강력한 개발 환경을 구축할 수 있습니다!`,

    'typescript-alternative': `# TypeScript 없이도 견고한 React 코드 작성하기

TypeScript의 인기가 높아지고 있지만, 모든 프로젝트에서 TypeScript를 도입할 수 있는 것은 아닙니다. 하지만 JavaScript만으로도 타입 안정성을 높이고 견고한 코드를 작성할 수 있는 방법들이 있습니다.

## 📝 JSDoc을 활용한 타입 문서화

JSDoc은 JavaScript 코드에 주석으로 타입 정보를 추가하는 표준 방법입니다.

### 기본 JSDoc 문법

\`\`\`javascript
/**
 * 사용자 정보를 표시하는 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.name - 사용자 이름
 * @param {string} props.email - 사용자 이메일
 * @param {number} [props.age] - 사용자 나이 (선택적)
 * @returns {React.Component} React 컴포넌트
 */
function UserCard({ name, email, age }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      {age && <span>나이: {age}</span>}
    </div>
  )
}
\`\`\`

### 복잡한 타입 정의

\`\`\`javascript
/**
 * @typedef {Object} User
 * @property {string} id - 사용자 ID
 * @property {string} name - 사용자 이름
 * @property {string} email - 이메일 주소
 * @property {Array<string>} roles - 사용자 권한
 */

/**
 * 사용자 목록을 렌더링하는 컴포넌트
 * @param {Object} props
 * @param {Array<User>} props.users - 사용자 배열
 * @param {function(User): void} props.onUserClick - 사용자 클릭 핸들러
 */
function UserList({ users, onUserClick }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserClick(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  )
}
\`\`\`

## 🛡️ PropTypes로 런타임 타입 검사

PropTypes는 React에서 제공하는 런타임 타입 검사 도구입니다.

### PropTypes 설치

\`\`\`bash
npm install prop-types
\`\`\`

### PropTypes 사용법

\`\`\`javascript
import PropTypes from 'prop-types'

function BlogPost({ title, content, author, publishedAt, tags }) {
  return (
    <article>
      <h1>{title}</h1>
      <div className="meta">
        <span>작성자: {author}</span>
        <time>{publishedAt}</time>
      </div>
      <div className="content">{content}</div>
      <div className="tags">
        {tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </article>
  )
}

BlogPost.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  publishedAt: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
}

BlogPost.defaultProps = {
  tags: []
}
\`\`\`

## 🔍 VS Code에서 타입 체크 활용하기

### settings.json 설정

\`\`\`json
{
  "js/ts.implicitProjectConfig.checkJs": true,
  "typescript.preferences.quoteStyle": "single",
  "typescript.suggest.autoImports": true
}
\`\`\`

### jsconfig.json 설정

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "checkJs": true
  },
  "include": [
    "src"
  ]
}
\`\`\`

## 🧪 코드 품질 도구 활용

### ESLint 설정

\`\`\`bash
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks
\`\`\`

\`\`\`javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'react/prop-types': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn'
  }
}
\`\`\`

## 💡 실무 활용 팁

1. **일관된 네이밍 컨벤션 사용**
2. **함수와 컴포넌트에 JSDoc 주석 작성**
3. **PropTypes로 모든 props 검증**
4. **ESLint로 코드 품질 관리**
5. **Prettier로 코드 포맷팅 자동화**

이러한 도구들을 조합하면 TypeScript 없이도 안전하고 유지보수가 쉬운 React 코드를 작성할 수 있습니다!`
  };
  
  return contentMap[postId] || '';
}

/**
 * 태그별 포스트 필터링
 * @param {Array} posts - 전체 포스트 배열
 * @param {string} tag - 필터링할 태그
 * @returns {Array} 필터링된 포스트 배열
 */
export function getPostsByTag(posts, tag) {
  return posts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

/**
 * 포스트 검색
 * @param {Array} posts - 전체 포스트 배열
 * @param {string} query - 검색어
 * @returns {Array} 검색 결과 포스트 배열
 */
export function searchPosts(posts, query) {
  if (!query.trim()) {
    return posts;
  }
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    (post.tags && post.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    ))
  );
}

export { parseFrontMatter, generateExcerpt }; 