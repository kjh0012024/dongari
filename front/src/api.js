// src/api.js

const BASE_URL = "http://localhost:4000";

export const mockApi = {
  login: async (user_id, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("[API] 로그인 실패:", data);
        return { success: false, error: data.message };
      }

      console.log("[API] 로그인 성공:", data);
      return {
        success: true,
        token: data.accessToken,
        user: data.user,
      };

    } catch (error) {
      console.error("[API] 로그인 요청 오류:", error);
      return { success: false, error: "네트워크 오류" };
    }
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
        { id: '1', club: '멋쟁이 사자처럼', content: '이번 주 정기 세션은 React Native 기초입니다. 모두 노트북 지참해주세요!', date: '2025-11-27' },
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
  // 4. 동아리 목록 API
  getCalendar: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'c1', title: '코딩 해커톤', date: '2025-12-01', club: '멋쟁이 사자처럼' },
        { id: 'c2', title: '댄스부 회식', date: '2025-12-05', club: '댄스 동아리' },
        { id: 'c3', title: '기말고사 간식행사', date: '2025-12-10', club: '총학생회' },
      ]), 1000);
    });
  },
  // 5. 캘린더 일정 API
  getUserInfo: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        email: 'test',
        school: '서울대학교',
      }), 500);
    });
  },

  updateUser: async (email, password, school) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[API] 정보 수정됨: ${email}, ${school}, 비번변경:${password ? 'O' : 'X'}`);
        resolve({ success: true });
      }, 1000);
    });
  },

  // ----------------- Management 기능 추가 -----------------
  _mockClubs: [
    { id: '101', name: '코딩 동아리', ownerId: '100', description: '코딩 좋아하는 사람 모여요!', coverImage: null, photos: [], applicants: [] },
    { id: '102', name: '댄스 동아리', ownerId: '200', description: '춤추는 걸 좋아하는 사람!', coverImage: null, photos: [], applicants: [] },
    { id: '103', name: '축구 동아리', ownerId: '100', description: '축구 즐기는 사람 모여요', coverImage: null, photos: [], applicants: [] },
  ],

  getUserJoinedClubs: async (userId) => {
    await new Promise(res => setTimeout(res, 300));
    // 가입한 동아리만 필터 (지금은 ownerId 기준)
    return mockApi._mockClubs.filter(c => c.ownerId === userId);
  },

  getClubById: async (clubId, userId) => {
    await new Promise(res => setTimeout(res, 300));
    const club = mockApi._mockClubs.find(c => c.id === clubId);
    if (!club) throw new Error("동아리 없음");
    return { ...club, isOwner: club.ownerId === userId };
  },

  updateClub: async (clubId, updates) => {
    await new Promise(res => setTimeout(res, 300));
    mockApi._mockClubs = mockApi._mockClubs.map(c => c.id === clubId ? { ...c, ...updates } : c);
    return mockApi._mockClubs.find(c => c.id === clubId);
  },

  uploadPhoto: async (clubId, uri) => {
    await new Promise(res => setTimeout(res, 300));
    const id = Date.now().toString();
    mockApi._mockClubs = mockApi._mockClubs.map(c =>
      c.id === clubId ? { ...c, photos: [...c.photos, { id, uri }] } : c
    );
    return { id, uri };
  },

  deletePhoto: async (clubId, photoId) => {
    await new Promise(res => setTimeout(res, 200));
    mockApi._mockClubs = mockApi._mockClubs.map(c =>
      c.id === clubId ? { ...c, photos: c.photos.filter(p => p.id !== photoId) } : c
    );
    return true;
  },

  getApplicants: async (clubId) => {
    await new Promise(res => setTimeout(res, 300));
    const club = mockApi._mockClubs.find(c => c.id === clubId);
    return club ? club.applicants : [];
  },

  acceptApplicant: async (clubId, applicantId) => {
    await new Promise(res => setTimeout(res, 300));
    const club = mockApi._mockClubs.find(c => c.id === clubId);
    if (!club) return null;
    const applicant = club.applicants.find(a => a.id === applicantId);
    if (applicant) applicant.status = "accepted";
    return applicant;
  },

  sendNotificationMock: async (userId, message) => {
    await new Promise(res => setTimeout(res, 200));
    console.log(`[MOCK NOTIFY] to:${userId} - ${message}`);
    return true;
  }
};
