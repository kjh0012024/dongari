// src/api.js

export const mockApi = {
  // 1. 로그인 API
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'test' && password === '1234') {
          console.log(`[API] 로그인 성공: ${email}`);
          resolve({ success: true, token: 'fake-jwt-token-123' });
        } else {
          console.log(`[API] 로그인 실패: ${email}`);
          resolve({ success: false });
        }
      }, 1000);
    });
  },

  // 2. [추가됨] 회원가입 API
  register: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // [가짜 중복 검사] 'test'라는 이메일은 이미 있다고 가정
        if (email === 'test') {
          console.log(`[API] 회원가입 실패(중복): ${email}`);
          resolve({ success: false, message: '이미 가입된 이메일입니다.' });
        } else {
          console.log(`[API] 회원가입 성공: ${email}`);
          resolve({ success: true });
        }
      }, 1000);
    });
  },

  // 3. 내 피드 API
  getFeed: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: '1', club: 'GET IT', content: '이번 주 정기 세션은 React Native 기초입니다. 모두 노트북 지참해주세요!', date: '2025-11-27' },
        { id: '2', club: '통기타 동아리', content: '가을 정기 공연이 다음주로 다가왔습니다. 많은 관심 부탁드려요 🎸', date: '2025-11-26' },
        { id: '3', club: 'FC 슛돌이', content: '이번 주말 친선 경기 라인업 공지합니다.', date: '2025-11-25' },
      ]), 1000);
    });
  },

  // 4. 동아리 목록 API
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
          resolve([
            { id: '103', name: '축구 동아리', school: 'A대학교', category: '운동' },
            { id: '104', name: '농구 동아리', school: 'C대학교', category: '운동' },
            { id: '101', name: '코딩 동아리', school: 'A대학교', category: '학술' },
          ]);
        }
      }, 800);
    });
  },

  // 5. 캘린더 일정 API
  getCalendar: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'c1', title: '코딩 해커톤', date: '2025-12-01', club: 'GET IT' },
        { id: 'c2', title: '댄스부 회식', date: '2025-12-05', club: '댄스 동아리' },
        { id: 'c3', title: '기말고사 간식행사', date: '2025-12-10', club: '총학생회' },
      ]), 1000);
    });
  },
  getUserInfo: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        email: 'test',       // 현재 아이디
        school: '서울대학교', // 현재 학교
      }), 500);
    });
  },
  // [추가] 회원 정보 수정 요청
  updateUser: async (email, password, school) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[API] 정보 수정됨: ${email}, ${school}, 비번변경:${password ? 'O' : 'X'}`);
        resolve({ success: true });
      }, 1000);
    });
  }
};