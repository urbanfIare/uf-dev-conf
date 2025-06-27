import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export const formatDate = (date, formatString = 'yyyy년 MM월 dd일') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: ko });
};

/**
 * 상대적 시간 표시 (예: "3일 전")
 */
export const formatRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: ko 
  });
};

/**
 * 개발 경력 계산
 */
export const calculateExperience = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  
  const totalMonths = years * 12 + months;
  const experienceYears = Math.floor(totalMonths / 12);
  const experienceMonths = totalMonths % 12;
  
  if (experienceYears === 0) {
    return `${experienceMonths}개월`;
  } else if (experienceMonths === 0) {
    return `${experienceYears}년`;
  } else {
    return `${experienceYears}년 ${experienceMonths}개월`;
  }
};

/**
 * 블로그 운영 일수 계산
 */
export const calculateBlogDays = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 읽기 시간 계산
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes}분`;
}; 