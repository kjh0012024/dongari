// src/api.js

// ----------------- 공용 딜레이 함수 -----------------
const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// ----------------- 모의 데이터 -----------------
let clubs = [
  { id: '101', name: '코딩 동아리', school: 'A대학교', category: '학술', description: '코딩 좋아하는 사람 모여요!', coverImage: null, photos: [], ownerId: '100', avgRating: 4.2 },
  { id: '102', name: '댄스 동아리', school: 'B대학교', category: '예술', description: '춤추는 걸 좋아하는 사람!', coverImage: null, photos: [], ownerId: '200', avgRating: 4.5 },
  { id: '103', name: '축구 동아리', school: 'A대학교', category: '운동', description: '축구 즐기는 사람 모여요', coverImage: null, photos: [], ownerId: '100', avgRating: 4.0 },
];

let applicantsStore = {
  '101': [
    { id: 'a1001', name: '학생A', studentId: '2025001', motive: '코딩 배우고 싶어요', status: 'pending' },
    { id: 'a1002', name: '학생B', studentId: '2025002', motive: '웹 개발 경험하고 싶어요', status: 'pending' },
  ],
  '102': [
    { id: 'a2001', name: '학생C', studentId: '2025003', motive: '댄스 경험', status: 'pending' },
  ],
  '103': [],
};

// ----------------- Mock API -----------------
export const mockApi = {
  // 로그인
  login: async (email, password) => {
    await delay(1000);
    if (email === 'test' && password === '1234') return { success: true, token: 'fake-jwt-token-123', userId: '100' };
    return { success: false };
  },

  // 회원가입
  register: async (email, password) => {
    await delay(1000);
    if (email === 'test') return { success: false, message: '이미 가입된 이메일입니다.' };
    return { success: true };
  },

  // 내 피드
  getFeed: async () => {
    await delay(1000);
    return [
      { id: '1', club: 'GET IT', content: '이번 주 정기 세션은 React Native 기초입니다. 모두 노트북 지참해주세요!', date: '2025-11-27' },
      { id: '2', club: '통기타 동아리', content: '가을 정기 공연이 다음주로 다가왔습니다. 많은 관심 부탁드려요 🎸', date: '2025-11-26' },
      { id: '3', club: 'FC 슛돌이', content: '이번 주말 친선 경기 라인업 공지합니다.', date: '2025-11-25' },
    ];
  },

  // 동아리 목록
  getClubs: async (type) => {
    await delay(800);
    return clubs;
  },

  // 캘린더
  getCalendar: async () => {
    await delay(1000);
    return [
      { id: 'c1', title: '코딩 해커톤', date: '2025-12-01', club: 'GET IT' },
      { id: 'c2', title: '댄스부 회식', date: '2025-12-05', club: '댄스 동아리' },
      { id: 'c3', title: '기말고사 간식행사', date: '2025-12-10', club: '총학생회' },
    ];
  },

  // ----------------- Management -----------------
  getUserJoinedClubs: async (userId) => {
    await delay(400);
    return clubs.filter(c => c.ownerId === userId || true); // 나중에 가입 멤버 기준 필터
  },

  getClubById: async (clubId, userId) => {
    await delay(300);
    const club = clubs.find(c => c.id === clubId);
    if (!club) throw new Error("동아리 없음");
    return { ...club, isOwner: club.ownerId === userId };
  },

  updateClub: async (clubId, updates) => {
    await delay(300);
    clubs = clubs.map(c => c.id === clubId ? { ...c, ...updates } : c);
    return clubs.find(c => c.id === clubId);
  },

  uploadPhoto: async (clubId, uri) => {
    await delay(400);
    const id = Date.now().toString();
    clubs = clubs.map(c => c.id === clubId ? { ...c, photos: [...c.photos, { id, uri }] } : c);
    return { id, uri };
  },

  deletePhoto: async (clubId, photoId) => {
    await delay(200);
    clubs = clubs.map(c => c.id === clubId ? { ...c, photos: c.photos.filter(p => p.id !== photoId) } : c);
    return true;
  },

  getApplicants: async (clubId) => {
    await delay(300);
    return applicantsStore[clubId] || [];
  },

  acceptApplicant: async (clubId, applicantId) => {
    await delay(300);
    const list = applicantsStore[clubId] || [];
    const idx = list.findIndex(a => a.id === applicantId);
    if (idx !== -1) list[idx].status = "accepted";
    return list[idx];
  },

  sendNotificationMock: async (userId, message) => {
    await delay(200);
    console.log(`[MOCK NOTIFY] to:${userId} - ${message}`);
    return true;
  }
};
