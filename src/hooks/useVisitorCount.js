import { useState, useEffect } from 'react';

export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  useEffect(() => {
    // localStorage 키들
    const VISITOR_COUNT_KEY = 'grove_blog_visitor_count';
    const TODAY_VISITORS_KEY = 'grove_blog_today_visitors';
    const LAST_VISIT_DATE_KEY = 'grove_blog_last_visit_date';
    const VISITOR_SESSION_KEY = 'grove_blog_visitor_session';

    // 오늘 날짜 (YYYY-MM-DD 형식)
    const today = new Date().toISOString().split('T')[0];

    // 기존 데이터 로드
    const storedVisitorCount = parseInt(localStorage.getItem(VISITOR_COUNT_KEY) || '0');
    const storedTodayVisitors = parseInt(localStorage.getItem(TODAY_VISITORS_KEY) || '0');
    const lastVisitDate = localStorage.getItem(LAST_VISIT_DATE_KEY);
    const currentSession = sessionStorage.getItem(VISITOR_SESSION_KEY);

    // 새로운 날짜인지 확인
    const isNewDay = lastVisitDate !== today;
    
    // 새로운 세션인지 확인 (브라우저 세션 기준)
    const isNewSession = !currentSession;

    let newVisitorCount = storedVisitorCount;
    let newTodayVisitors = isNewDay ? 0 : storedTodayVisitors;

    // 새로운 방문자인 경우
    if (isNewSession) {
      newVisitorCount += 1;
      newTodayVisitors += 1;
      setIsNewVisitor(true);
      
      // 세션 마킹
      sessionStorage.setItem(VISITOR_SESSION_KEY, 'visited');
    }

    // 새로운 날짜인 경우 오늘 방문자 수 초기화
    if (isNewDay) {
      localStorage.setItem(LAST_VISIT_DATE_KEY, today);
    }

    // 상태 업데이트
    setVisitorCount(newVisitorCount);
    setTodayVisitors(newTodayVisitors);

    // localStorage에 저장
    localStorage.setItem(VISITOR_COUNT_KEY, newVisitorCount.toString());
    localStorage.setItem(TODAY_VISITORS_KEY, newTodayVisitors.toString());
    localStorage.setItem(LAST_VISIT_DATE_KEY, today);

  }, []);

  return {
    visitorCount,
    todayVisitors,
    isNewVisitor
  };
} 