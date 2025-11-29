// src/api.js

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

const defaultHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || "요청에 실패했습니다.";
    throw new Error(message);
  }
  return data;
};

export const api = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: defaultHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await parseResponse(response);
      return {
        success: true,
        token: data.accessToken,
        user: data.user,
      };
    } catch (error) {
      console.error("[API] 로그인 오류", error);
      return { success: false, error: error.message };
    }
  },

  register: async (email, password, school) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: defaultHeaders(),
        body: JSON.stringify({ email, password, school }),
      });

      await parseResponse(response);
      return { success: true };
    } catch (error) {
      console.error("[API] 회원가입 오류", error);
      return { success: false, message: error.message };
    }
  },

  getSchools: async () => {
    try {
      const res = await fetch(`${BASE_URL}/schools`, { method: "GET" });
      const data = await parseResponse(res);
      return data.schools || [];
    } catch (err) {
      console.error("[API] 학교 목록 요청 오류", err);
      return [];
    }
  },

  getFeed: async () => {
    try {
      const res = await fetch(`${BASE_URL}/feed`);
      const data = await parseResponse(res);
      return Array.isArray(data)
        ? data.map(item => ({
            id: item.id?.toString?.() || String(item.POST_ID || ""),
            clubId: item.clubId ?? item.CLUB_ID,
            club: item.clubName ?? item.CLUB_NAME ?? "",
            content: item.content ?? item.CONTENT ?? "",
            date: item.createdAt ?? item.CREATED_AT ?? "",
            title: item.title ?? item.TITLE,
          }))
        : [];
    } catch (err) {
      console.error("[API] 피드 요청 오류", err);
      return [];
    }
  },

  getClubs: async ({ schoolId, category } = {}) => {
    try {
      const params = new URLSearchParams();
      if (schoolId) params.append("schoolId", schoolId);
      if (category) params.append("category", category);

      const query = params.toString();
      const res = await fetch(`${BASE_URL}/clubs${query ? `?${query}` : ""}`);
      const data = await parseResponse(res);
      return data || [];
    } catch (err) {
      console.error("[API] 동아리 목록 요청 오류", err);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${BASE_URL}/clubs/categories`);
      const data = await parseResponse(res);
      if (Array.isArray(data)) return data;
      return [];
    } catch (err) {
      console.error("[API] 카테고리 목록 요청 오류", err);
      return [];
    }
  },

  getCalendar: async () => {
    try {
      const res = await fetch(`${BASE_URL}/calendar/events`);
      const data = await parseResponse(res);

      if (Array.isArray(data)) {
        return data
          .map(item => ({
            id: item.id ?? item.POST_ID ?? Math.random().toString(),
            title: item.title ?? item.TITLE ?? "",
            description: item.description ?? item.CONTENT ?? "",
            date: item.date ?? item.CREATED_AT ?? "",
            club: item.club ?? item.CLUB_NAME ?? "",
          }))
          .filter(item => item.date);
      }
      return [];
    } catch (err) {
      console.error("[API] 캘린더 이벤트 요청 오류", err);
      return [];
    }
  },

  getUserInfo: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: defaultHeaders(token),
      });
      return await parseResponse(res);
    } catch (error) {
      console.error("[API] 사용자 정보 조회 오류", error);
      throw error;
    }
  },

  updateUser: async (token, { email, password, school }) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PUT",
        headers: defaultHeaders(token),
        body: JSON.stringify({ email, password, school }),
      });
      await parseResponse(res);
      return { success: true };
    } catch (error) {
      console.error("[API] 사용자 정보 수정 오류", error);
      return { success: false, message: error.message };
    }
  },

  applyToClub: async (clubId, payload, token) => {
    try {
      const res = await fetch(`${BASE_URL}/clubs/${clubId}/apply`, {
        method: "POST",
        headers: defaultHeaders(token),
        body: JSON.stringify(payload),
      });
      await parseResponse(res);
      return { success: true };
    } catch (error) {
      console.error("[API] 동아리 신청 오류", error);
      return { success: false, message: error.message };
    }
  },

  getUserJoinedClubs: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/users/me/clubs`, {
        headers: defaultHeaders(token),
      });
      const data = await parseResponse(res);
      return data || [];
    } catch (error) {
      console.error("[API] 내 동아리 조회 오류", error);
      return [];
    }
  },

  getClubById: async (clubId, token) => {
    const res = await fetch(`${BASE_URL}/clubs/${clubId}`, {
      headers: defaultHeaders(token),
    });
    return await parseResponse(res);
  },

  updateClub: async (clubId, updates, token) => {
    const res = await fetch(`${BASE_URL}/clubs/${clubId}`, {
      method: "PUT",
      headers: defaultHeaders(token),
      body: JSON.stringify(updates),
    });
    return await parseResponse(res);
  },

  uploadPhoto: async (clubId, uri, token) => {
    const res = await fetch(`${BASE_URL}/clubs/${clubId}/photos`, {
      method: "POST",
      headers: defaultHeaders(token),
      body: JSON.stringify({ uri }),
    });
    return await parseResponse(res);
  },

  deletePhoto: async (clubId, photoId, token) => {
    const res = await fetch(`${BASE_URL}/clubs/${clubId}/photos/${photoId}`, {
      method: "DELETE",
      headers: defaultHeaders(token),
    });
    await parseResponse(res);
    return true;
  },

  getApplicants: async (clubId, token) => {
    try {
      const res = await fetch(`${BASE_URL}/clubs/${clubId}/applicants`, {
        headers: defaultHeaders(token),
      });
      return await parseResponse(res);
    } catch (error) {
      console.error("[API] 신청자 목록 조회 오류", error);
      return [];
    }
  },

  acceptApplicant: async (clubId, applicantId, token) => {
    const res = await fetch(`${BASE_URL}/clubs/${clubId}/applicants/${applicantId}/accept`, {
      method: "POST",
      headers: defaultHeaders(token),
    });
    return await parseResponse(res);
  },

  sendNotification: async (userId, message, token) => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      method: "POST",
      headers: defaultHeaders(token),
      body: JSON.stringify({ userId, message }),
    });
    await parseResponse(res);
    return true;
  },
};
