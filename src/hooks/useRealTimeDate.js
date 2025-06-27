import { useState, useEffect } from 'react';
import { getRelativeTime } from '../utils/date';

/**
 * 실시간으로 상대 시간을 업데이트하는 훅
 * @param {string} dateString - 날짜 문자열
 * @param {number} updateInterval - 업데이트 간격 (밀리초, 기본값: 60초)
 * @returns {string} 실시간 상대 시간
 */
export function useRealTimeDate(dateString, updateInterval = 60000) {
  const [relativeTime, setRelativeTime] = useState(() => getRelativeTime(dateString));

  useEffect(() => {
    // 초기값 설정
    setRelativeTime(getRelativeTime(dateString));

    // 정기적 업데이트
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(dateString));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [dateString, updateInterval]);

  return relativeTime;
}

/**
 * 방금 작성된 글인지 확인하는 훅
 * @param {string} dateString - 날짜 문자열
 * @returns {boolean} 방금 작성된 글인지 여부
 */
export function useIsRecentPost(dateString) {
  const [isRecent, setIsRecent] = useState(false);

  useEffect(() => {
    const checkRecent = () => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      // 5분 이내에 작성된 글이면 "방금 전"으로 표시
      setIsRecent(diffMinutes <= 5);
    };

    checkRecent();
    const interval = setInterval(checkRecent, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, [dateString]);

  return isRecent;
} 