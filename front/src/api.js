// src/api.js
export const mockApi = {
  login: async (email, password) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  },
  getFeed: async () => {
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: '1', club: '멋쟁이 사자처럼', content: '이번 주 정기 세션 안내', date: '2025-11-27' },
      { id: '2', club: '통기타 동아리', content: '가을 정기 공연 초대', date: '2025-11-26' },
    ]), 1000));
  },
  getClubs: async (type) => {
    // type에 따라 다른 데이터를 줄 수도 있습니다.
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: '101', name: '코딩 동아리', school: 'A대학교', category: '학술' },
      { id: '102', name: '댄스 동아리', school: 'B대학교', category: '예술' },
      { id: '103', name: '축구 동아리', school: 'A대학교', category: '운동' },
    ]), 800));
  },
  getCalendar: async () => {
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: 'c1', title: '코딩 해커톤', date: '2025-12-01' },
      { id: 'c2', title: '댄스부 회식', date: '2025-12-05' },
    ]), 1000));
  }
};