---
title: "React 블로그 개발 여정 - 실시간 기능부터 동적 데이터까지"
date: "2025-06-30T13:20:00"
readTime: "12분"
category: "dev"
tags: ["React", "블로그", "실시간", "최적화", "UX"]
description: "하루 동안 React 블로그를 개발하며 구현한 실시간 방문자 추적, 동적 날짜 업데이트, 성능 최적화 등 다양한 기능들의 개발 과정"
---

오늘 하루 종일 React 블로그를 개발하면서 다양한 기능들을 구현했습니다. 단순한 정적 블로그에서 시작해서 실시간 기능과 동적 데이터를 활용한 인터랙티브한 블로그로 발전시키는 과정을 정리해보겠습니다.

## 🎯 개발 목표

- **사용자 경험 개선**: 로딩 상태, 실시간 업데이트
- **동적 데이터 활용**: 하드코딩 제거, 실제 데이터 기반 표시
- **성능 최적화**: 캐싱, 스켈레톤 UI, 컴포넌트 분리
- **실시간 기능**: 방문자 추적, 날짜 업데이트

## 🚀 주요 구현 기능들

### 1. 실시간 방문자 수 추적 시스템

```javascript
// src/hooks/useVisitorCount.js
export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  useEffect(() => {
    const updateVisitorCount = () => {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('lastVisit');
      const totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
      const todayVisitorsCount = parseInt(localStorage.getItem(`visitors_${today}`) || '0');

      // 새 방문자 감지 (30초 제한)
      if (!lastVisit || (Date.now() - parseInt(lastVisit)) > 30000) {
        const newTotal = totalVisitors + 1;
        const newTodayCount = todayVisitorsCount + 1;
        
        localStorage.setItem('totalVisitors', newTotal.toString());
        localStorage.setItem(`visitors_${today}`, newTodayCount.toString());
        localStorage.setItem('lastVisit', Date.now().toString());
        
        setVisitorCount(newTotal);
        setTodayVisitors(newTodayCount);
        setIsNewVisitor(true);
      }
    };

    updateVisitorCount();
  }, []);

  return { visitorCount, todayVisitors, isNewVisitor };
}
```

**핵심 포인트:**
- `localStorage`를 활용한 방문자 데이터 저장
- 30초 간격 제한으로 스팸 방지
- 새 방문자 환영 메시지 표시

### 2. 실시간 날짜 업데이트 시스템

기존 문제점: 날짜만 있으면 0시 기준으로 계산되어 부정확한 상대 시간 표시

```javascript
// src/hooks/useRealTimeDate.js
export function useRealTimeDate(dateString, updateInterval = 60000) {
  const [relativeTime, setRelativeTime] = useState(() => getRelativeTime(dateString));

  useEffect(() => {
    setRelativeTime(getRelativeTime(dateString));

    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(dateString));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [dateString, updateInterval]);

  return relativeTime;
}
```

**개선된 날짜 계산 로직:**
```javascript
// src/utils/date.js
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // 미래 날짜 5분 이내는 "방금 전"으로 표시 (시간대 오차 허용)
  if (diffMs < 0) {
    const futureDiffMs = Math.abs(diffMs);
    const futureMinutes = Math.floor(futureDiffMs / (1000 * 60));
    
    if (futureMinutes <= 5) {
      return '방금 전';
    }
    return formatDate(dateString);
  }

  // 30초 이내는 무조건 "방금 전"
  if (diffSeconds < 30) {
    return '방금 전';
  }
  // ... 나머지 계산 로직
};
```

**해결 과정:**
1. **문제 발견**: "방금 작성한 글도 8시간 지났다고 표시"
2. **원인 분석**: 날짜에 시간 정보 없음 → 0시 기준 계산
3. **해결책**: 모든 포스트에 정확한 시간 정보 추가
   - `"2025-06-27"` → `"2025-06-27T17:50:00"`

### 3. 스켈레톤 UI와 성능 최적화

```jsx
// src/components/common/Skeleton.jsx
export function PostListSkeleton({ count = 3 }) {
  return (
    <div className="posts-section">
      <div className="posts-container">
        <div className="posts-grid">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="post-card skeleton">
              <div className="post-header">
                <div className="skeleton-title"></div>
                <div className="skeleton-excerpt"></div>
              </div>
              <div className="post-footer">
                <div className="skeleton-meta"></div>
                <div className="skeleton-tags"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**캐싱 시스템:**
```javascript
// src/hooks/usePostsCache.js
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export function usePostsCache() {
  const [cache, setCache] = useState({});

  const getCachedPosts = useCallback(async (key, fetchFunction) => {
    const now = Date.now();
    const cached = cache[key];

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }

    const data = await fetchFunction();
    setCache(prev => ({
      ...prev,
      [key]: { data, timestamp: now }
    }));

    return data;
  }, [cache]);

  return { getCachedPosts };
}
```

### 4. 동적 포스트 개수 추적

기존 문제점: 하드코딩된 글 개수 (`const postsCount = 2`)

```javascript
// src/hooks/usePostCount.js
export function usePostCount() {
  const [postStats, setPostStats] = useState({
    total: 0,
    dev: 0,
    life: 0,
    isLoading: true
  });

  useEffect(() => {
    const loadPostStats = async () => {
      try {
        const posts = await getAllPosts();
        
        const stats = {
          total: posts.length,
          dev: posts.filter(post => post.category === 'dev').length,
          life: posts.filter(post => post.category === 'life').length,
          isLoading: false
        };
        
        setPostStats(stats);
      } catch (error) {
        console.error('포스트 통계 로딩 실패:', error);
        setPostStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadPostStats();
  }, []);

  return postStats;
}
```

**HeroSection에서 활용:**
```jsx
function HeroSection() {
  const { total: postsCount, isLoading: isPostsLoading } = usePostCount();

  return (
    <div className="stat-item">
      <span className="stat-number">
        {isPostsLoading ? '...' : postsCount}
      </span>
      <span className="stat-label">작성한 글</span>
    </div>
  );
}
```

### 5. 컴포넌트 분리와 최적화

**PostList 컴포넌트 분리:**
```jsx
// 개별 포스트 아이템 컴포넌트 (실시간 날짜 업데이트용)
function PostItem({ post, onPostSelect }) {
  const relativeTime = useRealTimeDate(post.date, 30000); // 30초마다 업데이트

  return (
    <article className="post-card" onClick={() => onPostSelect(post)}>
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
      </div>
      <div className="post-footer">
        <div className="post-meta">
          <div className="meta-item">
            <Clock size={16} />
            <span>{relativeTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
```

## 🎨 UI/UX 개선사항

### 1. 툴팁 시스템
```css
.value-item {
  position: relative;
  cursor: pointer;
}

.value-item::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tooltip-bg);
  color: var(--tooltip-color);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.value-item:hover::before {
  opacity: 1;
  visibility: visible;
  bottom: calc(100% + 8px);
}
```

### 2. 로딩 상태 관리
```jsx
// 최소 200ms 로딩 시간으로 스켈레톤 표시 보장
setTimeout(() => {
  if (isMountedRef.current) {
    setPosts(postsCache[category]);
    setIsLoading(false);
  }
}, 200);
```

### 3. 검색 기능
```jsx
const [searchTerm, setSearchTerm] = useState('');

const filteredPosts = posts.filter(post =>
  post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (post.tags && post.tags.some(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  ))
);
```

## 📊 성능 최적화 결과

### Before vs After

**Before:**
- 하드코딩된 데이터 (글 개수: 2개 고정)
- 정적 날짜 표시 (부정확한 상대 시간)
- 로딩 상태 없음
- 컴포넌트 재렌더링 최적화 부족

**After:**
- 동적 데이터 (실제 포스트 개수 반영)
- 실시간 날짜 업데이트 (30초마다 갱신)
- 스켈레톤 UI로 로딩 경험 개선
- 컴포넌트 분리로 성능 최적화
- 5분 캐싱으로 불필요한 API 호출 방지

## 🔧 기술 스택 및 패턴

### 사용된 기술
- **React Hooks**: useState, useEffect, useCallback
- **Custom Hooks**: 재사용 가능한 로직 분리
- **LocalStorage**: 클라이언트 사이드 데이터 저장
- **CSS Variables**: 다크모드 지원
- **Markdown**: 콘텐츠 관리

### 적용된 패턴
- **Container/Presenter Pattern**: 로직과 UI 분리
- **Custom Hook Pattern**: 상태 로직 재사용
- **Caching Pattern**: 성능 최적화
- **Loading State Pattern**: 사용자 경험 개선

## 🚀 앞으로의 계획

1. **댓글 시스템 구현**
2. **태그 기반 필터링**
3. **검색 기능 고도화**
4. **RSS 피드 생성**
5. **SEO 최적화**
6. **PWA 기능 추가**

## 💡 배운 점들

### 1. **사용자 경험의 중요성**
- 단순한 기능도 사용자 관점에서 생각하면 개선점이 많다
- 로딩 상태, 실시간 업데이트 등 작은 디테일이 큰 차이를 만든다

### 2. **성능과 UX의 균형**
- 너무 빠른 로딩은 오히려 어색할 수 있다
- 적절한 로딩 시간으로 사용자에게 피드백 제공

### 3. **데이터 정확성**
- 하드코딩된 데이터는 언젠가 문제가 된다
- 처음부터 동적 데이터를 고려한 설계가 중요

### 4. **컴포넌트 설계**
- 단일 책임 원칙: 각 컴포넌트는 하나의 역할만
- 재사용성: Custom Hook으로 로직 분리

## 🎯 마무리

하루 동안 많은 기능을 구현하면서 React의 강력함을 다시 한 번 느꼈습니다. 특히 Custom Hook을 활용한 로직 분리와 실시간 기능 구현이 인상적이었습니다.

가장 중요한 것은 **사용자 관점에서 생각하기**였습니다. "방금 작성한 글이 8시간 전으로 표시되는 것"처럼 작은 디테일이 사용자 경험에 큰 영향을 미친다는 것을 깨달았습니다.

앞으로도 계속해서 사용자 중심의 개발을 이어가며, 더 나은 블로그를 만들어나가겠습니다! 🚀

---

*이 글이 React 블로그 개발에 도움이 되었나요? 궁금한 점이나 개선 아이디어가 있다면 언제든 공유해주세요! 💬* 