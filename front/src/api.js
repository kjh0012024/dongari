// src/api.js

const BASE_URL = "http://172.20.122.143:4000";

export const mockApi = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
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

  // 2. [수정됨] 회원가입 API
  register: async (email, password, school) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          school,   // 🔹 여기에 학교 이름도 같이 보냄
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("[API] 회원가입 실패:", data);
        return { success: false, message: data.message };
      }

      console.log("[API] 회원가입 성공:", data);
      return { success: true };
    } catch (error) {
      console.error("[API] 회원가입 요청 오류:", error);
      return { success: false, message: "네트워크 오류" };
    }
  },
  
  getSchools: async () => {
    try {
      const res = await fetch(`${BASE_URL}/schools`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log("[API] 학교 목록 조회 실패:", data);
        return [];   // 실패 시 빈 배열 반환
      }

      return data.schools || [];
    } catch (err) {
      console.error("[API] 학교 목록 요청 오류:", err);
      return [];
    }
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
  getClubs: async ({ schoolId, category } = {}) => {
    try {
      const params = new URLSearchParams();
      if (schoolId) params.append("schoolId", schoolId);
      if (category) params.append("category", category);

      const query = params.toString();
      const res = await fetch(`${BASE_URL}/clubs${query ? `?${query}` : ""}`);
      const data = await res.json();

      if (!res.ok) {
        console.log("[API] 동아리 목록 조회 실패:", data);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("[API] 동아리 목록 요청 오류:", err);
      return [];
    }
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
