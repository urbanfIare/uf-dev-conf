import { useState, useEffect } from 'react';
import { THEME_STORAGE_KEY } from '../utils/constants';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 초기 테마 설정
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
  }, []);

  // 테마 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return {
    isDarkMode,
    toggleTheme,
  };
}; 