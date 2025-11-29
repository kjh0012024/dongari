// src/api.js

// 기본 API URL을 환경변수에서 가져오고, 없으면 로컬 서버로 fallback 합니다.
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

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
    try {
      const res = await fetch(`${BASE_URL}/feed`);
      const data = await res.json();

      if (!res.ok) {
        console.log("[API] 피드 조회 실패:", data);
        return [];
      }

      return Array.isArray(data)
        ? data.map(item => ({
            id: item.id?.toString?.() || String(item.POST_ID || ""),
            clubId: item.clubId ?? item.CLUB_ID,
            club: item.clubName ?? item.CLUB_NAME ?? "", // 기존 UI 호환
            content: item.content ?? item.CONTENT ?? "",
            date: item.createdAt ?? item.CREATED_AT ?? "",
            title: item.title ?? item.TITLE,
          }))
        : [];
    } catch (err) {
      console.error("[API] 피드 요청 오류:", err);
      return [];
    }
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

  // 카테고리 목록 API
  getCategories: async () => {
    try {
      const res = await fetch(`${BASE_URL}/clubs/categories`);
      const data = await res.json();

      let categories = [];

      if (res.ok && Array.isArray(data)) {
        categories = data;
      } else {
        console.log("[API] 카테고리 목록 조회 실패:", data);
      }

      // API가 빈 배열을 반환하거나 실패하면, 기존 동아리 목록에서 카테고리를 추출하여 대체합니다.
      if (!categories.length) {
        const clubs = await mockApi.getClubs();
        categories = clubs
          .flatMap(club => (club.category || "")
            .split(",")
            .map(name => name.trim())
            .filter(Boolean)
          );
      }

      // 중복 제거 후 정렬
      const uniqueCategories = [...new Set(categories)]
        .map(name => name.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      return uniqueCategories;
    } catch (err) {
      console.error("[API] 카테고리 목록 요청 오류:", err);
      return [];
    }
  },
  // 4. 캘린더 이벤트 API
  getCalendar: async () => {
    try {
      const res = await fetch(`${BASE_URL}/calendar/events`);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        return data.map(item => ({
          id: item.id ?? item.POST_ID ?? Math.random().toString(),
          title: item.title ?? item.TITLE ?? "",
          description: item.description ?? item.CONTENT ?? "",
          date: item.date ?? item.CREATED_AT ?? "",
          club: item.club ?? item.CLUB_NAME ?? "",
        })).filter(item => item.date);
      }
      console.log("[API] 캘린더 이벤트 조회 실패:", data);
    } catch (err) {
      console.error("[API] 캘린더 이벤트 요청 오류:", err);
    }

    // 실패하거나 빈 응답일 경우, 예시 데이터 반환
    return [
      { id: 'c1', title: '코딩 해커톤', description: '팀별 프로젝트 해커톤', date: '2025-12-01', club: '멋쟁이 사자처럼' },
      { id: 'c2', title: '댄스부 회식', description: '학기말 댄스파티', date: '2025-12-05', club: '댄스 동아리' },
      { id: 'c3', title: '기말고사 간식행사', description: '시험기간 간식 배부', date: '2025-12-10', club: '총학생회' },
    ];
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
