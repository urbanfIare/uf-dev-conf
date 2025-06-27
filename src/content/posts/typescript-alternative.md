---
title: "TypeScript 없이도 견고한 React 코드 작성하기"
date: "2025-06-27T14:20:00"
readTime: ""
category: "dev"
tags: ["JavaScript", "React", "Best Practices", "JSDoc"]
description: "TypeScript를 사용하지 않더라도 PropTypes와 JSDoc을 활용하여 견고한 React 코드를 작성하는 방법"
---

TypeScript의 인기가 높아지고 있지만, 모든 프로젝트에서 TypeScript를 도입할 수 있는 것은 아닙니다. 하지만 JavaScript만으로도 **타입 안정성을 높이고 견고한 코드**를 작성할 수 있는 방법들이 있습니다.

## 🤔 TypeScript를 사용하지 않는 이유

### 일반적인 상황들:
- 기존 JavaScript 프로젝트의 마이그레이션 부담
- 팀의 TypeScript 학습 곡선
- 빠른 프로토타이핑이 필요한 경우
- 작은 규모의 프로젝트
- 클라이언트 요구사항

이런 상황에서도 **코드 품질을 유지**할 수 있는 방법들을 알아보겠습니다.

## 📝 JSDoc을 활용한 타입 문서화

JSDoc은 JavaScript 코드에 주석으로 타입 정보를 추가하는 표준 방법입니다.

### 기본 JSDoc 문법

```javascript
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
      {age && <p>나이: {age}세</p>}
    </div>
  )
}
```

### 복잡한 타입 정의

```javascript
/**
 * @typedef {Object} User
 * @property {string} id - 사용자 ID
 * @property {string} name - 사용자 이름
 * @property {string} email - 이메일
 * @property {string[]} roles - 사용자 역할 배열
 * @property {Date} createdAt - 생성일
 */

/**
 * 사용자 목록을 렌더링하는 컴포넌트
 * @param {Object} props
 * @param {User[]} props.users - 사용자 배열
 * @param {function(User): void} props.onUserClick - 사용자 클릭 핸들러
 * @returns {React.Component}
 */
function UserList({ users, onUserClick }) {
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard 
          key={user.id}
          {...user}
          onClick={() => onUserClick(user)}
        />
      ))}
    </div>
  )
}
```

## 🔍 PropTypes로 런타임 타입 검증

PropTypes는 컴포넌트의 props 타입을 런타임에 검증하는 React의 공식 라이브러리입니다.

### PropTypes 설치

```bash
npm install prop-types
```

### 기본 사용법

```javascript
import PropTypes from 'prop-types'

function Button({ children, variant, size, disabled, onClick }) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  onClick: () => {}
}
```

### 고급 PropTypes 패턴

```javascript
import PropTypes from 'prop-types'

// 커스텀 밸리데이터
const emailValidator = (props, propName, componentName) => {
  const email = props[propName]
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return new Error(
      `Invalid email '${email}' supplied to '${componentName}'. Expected a valid email address.`
    )
  }
}

function ContactForm({ user, onSubmit }) {
  // 컴포넌트 로직
}

ContactForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: emailValidator,
    preferences: PropTypes.objectOf(PropTypes.bool)
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
}
```

## 🛡️ 방어적 프로그래밍 패턴

### 1. 기본값 설정

```javascript
function UserProfile({ user = {} }) {
  const {
    name = '이름 없음',
    email = '',
    avatar = '/default-avatar.png',
    roles = []
  } = user

  return (
    <div className="user-profile">
      <img src={avatar} alt={`${name}의 프로필`} />
      <h2>{name}</h2>
      <p>{email}</p>
      <div className="roles">
        {roles.map(role => (
          <span key={role} className="role-badge">
            {role}
          </span>
        ))}
      </div>
    </div>
  )
}
```

### 2. 조건부 렌더링

```javascript
function PostList({ posts }) {
  // 배열 검증
  if (!Array.isArray(posts)) {
    console.warn('PostList: posts는 배열이어야 합니다.')
    return <div>데이터 형식 오류</div>
  }

  // 빈 배열 처리
  if (posts.length === 0) {
    return <div className="empty-state">게시글이 없습니다.</div>
  }

  return (
    <div className="post-list">
      {posts.map(post => {
        // 필수 필드 검증
        if (!post?.id || !post?.title) {
          console.warn('PostList: 유효하지 않은 포스트 데이터', post)
          return null
        }

        return (
          <article key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.excerpt || '내용 미리보기가 없습니다.'}</p>
          </article>
        )
      })}
    </div>
  )
}
```

## 🔧 개발 도구 활용

### 1. VS Code 설정

```json
// .vscode/settings.json
{
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "javascript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### 2. JSDoc과 VS Code 통합

```javascript
/**
 * @param {string} url - API 엔드포인트
 * @param {Object} [options={}] - fetch 옵션
 * @returns {Promise<any>} API 응답 데이터
 */
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API 요청 실패:', error)
    throw error
  }
}
```

## ✅ 코드 품질 도구

### ESLint 규칙 설정

```javascript
// eslint.config.js
export default [
  {
    rules: {
      // 변수 사용 전 선언 강제
      'no-undef': 'error',
      
      // 사용하지 않는 변수 감지
      'no-unused-vars': 'warn',
      
      // 일관된 따옴표 사용
      'quotes': ['error', 'single'],
      
      // 세미콜론 강제
      'semi': ['error', 'always'],
      
      // React 관련 규칙
      'react/prop-types': 'warn',
      'react/no-unescaped-entities': 'warn'
    }
  }
]
```

### Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🧪 테스트로 타입 안정성 확보

```javascript
// UserCard.test.js
import { render, screen } from '@testing-library/react'
import UserCard from './UserCard'

describe('UserCard', () => {
  test('필수 props가 누락되면 에러가 발생한다', () => {
    // PropTypes 에러 감지
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<UserCard />)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Warning: Failed prop type')
    )
    
    consoleSpy.mockRestore()
  })

  test('올바른 props로 정상 렌더링된다', () => {
    const user = {
      name: '홍길동',
      email: 'hong@example.com'
    }

    render(<UserCard {...user} />)
    
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('hong@example.com')).toBeInTheDocument()
  })
})
```

## 📚 코드 스타일 가이드

### 1. 명확한 함수명과 변수명

```javascript
// ❌ 나쁜 예
function calc(a, b) {
  return a * b * 0.1
}

// ✅ 좋은 예
function calculateDiscountAmount(originalPrice, discountRate) {
  return originalPrice * discountRate * 0.01
}
```

### 2. 일관된 구조

```javascript
// 컴포넌트 구조 템플릿
function ComponentName({ prop1, prop2, onEvent }) {
  // 1. 상태 및 훅
  const [state, setState] = useState(initialState)
  
  // 2. 이벤트 핸들러
  const handleClick = useCallback(() => {
    onEvent?.(state)
  }, [state, onEvent])
  
  // 3. 렌더링
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  )
}

// 4. PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onEvent: PropTypes.func
}

// 5. defaultProps
ComponentName.defaultProps = {
  prop2: 0
}

export default ComponentName
```

## 🎯 실전 팁

### 1. 점진적 개선

```javascript
// 단계 1: 기본 컴포넌트
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>
}

// 단계 2: JSDoc 추가
/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {function} props.onClick
 */
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>
}

// 단계 3: PropTypes 추가
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
}
```

### 2. 유틸리티 함수 검증

```javascript
/**
 * 안전한 JSON 파싱
 * @param {string} jsonString - 파싱할 JSON 문자열
 * @param {any} fallback - 파싱 실패시 반환할 기본값
 * @returns {any} 파싱된 객체 또는 기본값
 */
function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.warn('JSON 파싱 실패:', error.message)
    return fallback
  }
}
```

## 🚀 결론

TypeScript를 사용하지 않더라도 다음 방법들로 견고한 React 코드를 작성할 수 있습니다:

- ✅ **JSDoc**: 타입 정보 문서화 및 IDE 지원
- ✅ **PropTypes**: 런타임 타입 검증
- ✅ **방어적 프로그래밍**: 예외 상황 대비
- ✅ **개발 도구**: ESLint, Prettier로 코드 품질 관리
- ✅ **테스트**: 타입 안정성 검증
- ✅ **일관된 코딩 스타일**: 명확하고 읽기 쉬운 코드

이러한 방법들을 조합하면 TypeScript 없이도 **유지보수하기 쉽고 안정적인** React 애플리케이션을 개발할 수 있습니다! 🎉 