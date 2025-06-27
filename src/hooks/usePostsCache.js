import { useState, useEffect, useRef } from 'react';
import { getAllPosts, getPostsByCategory } from '../utils/posts';

// 전역 캐시 객체
const postsCache = {
  all: null,
  dev: null,
  life: null,
  lastFetch: {}
};

// 캐시 유효 시간 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

export function usePostsCache(category = 'all') {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      // 캐시 확인
      const now = Date.now();
      const lastFetch = postsCache.lastFetch[category] || 0;
      const isCacheValid = (now - lastFetch) < CACHE_DURATION;
      
      if (postsCache[category] && isCacheValid) {
        // 캐시된 데이터 사용 (최소 200ms 로딩 시간으로 스켈레톤 표시)
        setTimeout(() => {
          if (isMountedRef.current) {
            setPosts(postsCache[category]);
            setIsLoading(false);
          }
        }, 200);
        return;
      }

      // 새로운 데이터 fetch
      setIsLoading(true);
      setError(null);

      try {
        let newPosts;
        if (category === 'all') {
          newPosts = await getAllPosts();
        } else {
          newPosts = await getPostsByCategory(category);
        }

        // 캐시 업데이트
        postsCache[category] = newPosts;
        postsCache.lastFetch[category] = now;

        if (isMountedRef.current) {
          setPosts(newPosts);
        }
      } catch (err) {
        console.error(`포스트 로딩 실패 (${category}):`, err);
        if (isMountedRef.current) {
          setError('포스트를 불러오는데 실패했습니다.');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
  }, [category]);

  // 캐시 무효화 함수
  const invalidateCache = (targetCategory = category) => {
    postsCache[targetCategory] = null;
    postsCache.lastFetch[targetCategory] = 0;
  };

  // 전체 캐시 클리어
  const clearAllCache = () => {
    Object.keys(postsCache).forEach(key => {
      if (key !== 'lastFetch') {
        postsCache[key] = null;
      }
    });
    postsCache.lastFetch = {};
  };

  return {
    posts,
    isLoading,
    error,
    invalidateCache,
    clearAllCache
  };
} 