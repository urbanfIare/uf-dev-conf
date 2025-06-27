// Grove 블로그 상수들

export const BLOG_CONFIG = {
  title: 'Grove',
  subtitle: '함께 자라는 개발 숲',
  author: '노경환',
  description: '나무와 같이 성장하고 결실을 맺고 싶은 사람, 주변 사람들이 힘들 때 쉬어갈 수 있는 사람',
  email: 'ghroh0915@gmail.com',
  github: 'https://github.com/urbanfIare',
  linkedin: 'https://linkedin.com/in/gyeonghwan-roh-ab4a96261',
  startDate: '2021-01-01', // 개발 시작일
};

export const NAVIGATION_ITEMS = [
  { name: '홈', path: '/', id: 'home' },
  { name: '기술', path: '/tech', id: 'tech' },
  { name: '일상', path: '/daily', id: 'daily' },
  { name: '소개', path: '/about', id: 'about' },
];

export const HERO_VALUES = [
  { icon: '🌱', title: '꾸준한 성장', description: '매일 조금씩 발전하는 개발자' },
  { icon: '🤝', title: '함께하는 여정', description: '동료들과 함께 성장하는 즐거움' },
  { icon: '🏠', title: '따뜻한 쉼터', description: '누구나 편안하게 쉴 수 있는 공간' },
  { icon: '💚', title: '따뜻한 공동체', description: '서로 도우며 함께 나아가는 커뮤니티' },
];

export const THEME_STORAGE_KEY = 'grove-theme';

export const POST_CATEGORIES = {
  TECH: 'tech',
  DAILY: 'daily',
  REVIEW: 'review',
  TUTORIAL: 'tutorial',
};

export const READING_TIME_WPM = 200; // 분당 읽기 단어 수 