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
    const LAST_VISIT_TIME_KEY = 'grove_blog_last_visit_time';
    const FIRST_VISIT_KEY = 'grove_blog_first_visit';

    // 현재 시간과 오늘 날짜
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    // 기존 데이터 로드
    const storedVisitorCount = parseInt(localStorage.getItem(VISITOR_COUNT_KEY) || '0');
    const storedTodayVisitors = parseInt(localStorage.getItem(TODAY_VISITORS_KEY) || '0');
    const lastVisitDate = localStorage.getItem(LAST_VISIT_DATE_KEY);
    const lastVisitTime = parseInt(localStorage.getItem(LAST_VISIT_TIME_KEY) || '0');
    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

    // 새로운 날짜인지 확인
    const isNewDay = lastVisitDate !== today;
    
    // 처음 방문하는지 확인
    const isFirstTimeVisitor = !firstVisit;
    
    // 최소 방문 간격 (30초) - 새로고침 스팸 방지
    const MIN_VISIT_INTERVAL = 30 * 1000; // 30초
    const isNewVisit = (now - lastVisitTime) > MIN_VISIT_INTERVAL;

    let newVisitorCount = storedVisitorCount;
    let newTodayVisitors = isNewDay ? 0 : storedTodayVisitors;

    // 새로운 방문으로 카운트할 조건
    // 1. 처음 방문하거나
    // 2. 마지막 방문으로부터 30초 이상 지났을 때
    if (isFirstTimeVisitor || isNewVisit) {
      newVisitorCount += 1;
      newTodayVisitors += 1;
      
      // 처음 방문자 표시
      if (isFirstTimeVisitor) {
        setIsNewVisitor(true);
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
      }

      // 방문 시간 업데이트
      localStorage.setItem(LAST_VISIT_TIME_KEY, now.toString());
    }

    // 새로운 날짜인 경우 오늘 방문자 수만 초기화
    if (isNewDay) {
      newTodayVisitors = 1; // 오늘 첫 방문
      localStorage.setItem(LAST_VISIT_DATE_KEY, today);
      localStorage.setItem(LAST_VISIT_TIME_KEY, now.toString());
      
      // 총 방문자 수도 증가 (날이 바뀌어도 방문은 방문)
      if (!isFirstTimeVisitor) {
        newVisitorCount += 1;
      }
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