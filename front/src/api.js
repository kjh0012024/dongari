// src/api.js

export const mockApi = {
  // 1. 로그인 API (아이디/비번 검사 기능 포함)
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // [검사 과정] 실제 서버처럼 아이디와 비번을 확인합니다.
        // 아이디: test, 비번: 1234 일 때만 성공
        if (email === 'test' && password === '1234') {
          console.log(`[API] 로그인 성공: ${email}`);
          resolve({ success: true, token: 'fake-jwt-token-123' });
        } else {
          console.log(`[API] 로그인 실패: ${email}`);
          resolve({ success: false });
        }
      }, 1000); // 1초 동안 로딩하는 척 (지연 시간)
    });
  },

  // 2. 내 피드 API (가짜 게시물 데이터)
  getFeed: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: '1', club: '멋쟁이 사자처럼', content: '이번 주 정기 세션은 React Native 기초입니다. 모두 노트북 지참해주세요!', date: '2025-11-27' },
        { id: '2', club: '통기타 동아리', content: '가을 정기 공연이 다음주로 다가왔습니다. 많은 관심 부탁드려요 🎸', date: '2025-11-26' },
        { id: '3', club: 'FC 슛돌이', content: '이번 주말 친선 경기 라인업 공지합니다.', date: '2025-11-25' },
      ]), 1000);
    });
  },

  // 3. 동아리 목록 API (학교별/카테고리별 필터링 흉내)
  getClubs: async (type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === '학교별') {
          resolve([
            { id: '101', name: '코딩 동아리', school: 'A대학교', category: '학술' },
            { id: '102', name: '댄스 동아리', school: 'B대학교', category: '예술' },
            { id: '105', name: '사진 동아리', school: 'A대학교', category: '예술' },
          ]);
        } else {
          // 카테고리별
          resolve([
            { id: '103', name: '축구 동아리', school: 'A대학교', category: '운동' },
            { id: '104', name: '농구 동아리', school: 'C대학교', category: '운동' },
            { id: '101', name: '코딩 동아리', school: 'A대학교', category: '학술' },
          ]);
        }
      }, 800);
    });
  },

  // 4. 캘린더 일정 API
  getCalendar: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'c1', title: '코딩 해커톤', date: '2025-12-01', club: '멋쟁이 사자처럼' },
        { id: 'c2', title: '댄스부 회식', date: '2025-12-05', club: '댄스 동아리' },
        { id: 'c3', title: '기말고사 간식행사', date: '2025-12-10', club: '총학생회' },
      ]), 1000);
    });
  }
};