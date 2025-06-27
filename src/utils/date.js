/**
 * 날짜를 yyyy-mm-dd 형식으로 포맷팅
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // 유효하지 않은 날짜면 원본 반환
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 현재 시간 기준으로 상대적 시간 계산 (개선된 버전)
 */
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return dateString; // 유효하지 않은 날짜면 원본 반환
  }
  
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // 미래 날짜인 경우 (방금 작성한 글이면 방금 전으로 표시)
  if (diffMs < 0) {
    const futureDiffMs = Math.abs(diffMs);
    const futureMinutes = Math.floor(futureDiffMs / (1000 * 60));
    
    // 5분 이내 미래라면 "방금 전"으로 표시 (시간대 차이나 약간의 오차 허용)
    if (futureMinutes <= 5) {
      return '방금 전';
    }
    return formatDate(dateString); // 그 외에는 절대 날짜로 표시
  }

  // 과거 날짜 처리
  if (diffSeconds < 30) {
    return '방금 전';
  } else if (diffSeconds < 60) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}주 전`;
  } else if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  } else {
    return `${diffYears}년 전`;
  }
};

/**
 * 오늘 날짜를 yyyy-mm-dd 형식으로 반환
 */
export const getTodayDate = () => {
  const today = new Date();
  return formatDate(today.toISOString());
};

/**
 * 현재 시간을 포함한 오늘 날짜를 ISO 형식으로 반환
 */
export const getNowDateTime = () => {
  return new Date().toISOString();
};

/**
 * 상대적 시간과 절대 날짜를 함께 제공
 */
export const getTimeDisplay = (dateString) => {
  return {
    relative: getRelativeTime(dateString),
    absolute: formatDate(dateString)
  };
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