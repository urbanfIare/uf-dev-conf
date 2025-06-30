import { useState, useEffect } from 'react';
import { getAllPosts } from '../utils/posts';

/**
 * 실시간으로 포스트 개수를 추적하는 훅
 * @returns {Object} 포스트 통계 정보
 */
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

/**
 * 특정 카테고리의 포스트 개수만 가져오는 훅
 * @param {string} category - 카테고리 ('dev', 'life', 또는 null)
 * @returns {number} 해당 카테고리의 포스트 개수
 */
export function useCategoryPostCount(category = null) {
  const { total, dev, life, isLoading } = usePostCount();
  
  if (isLoading) return 0;
  
  switch (category) {
    case 'dev':
      return dev;
    case 'life':
      return life;
    default:
      return total;
  }
} 