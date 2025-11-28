// back/src/routes/auth.js
import { Router } from "express";
import oracledb from "oracledb";
//import bcrypt from "bcrypt";
import { getConnection } from "../db.js";

const router = Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  // 1) 필수 필드 체크
  if (!user_id || !password) {
    return res.status(400).json({
      errorCode: "AUTH_REQUIRED_FIELDS",
      message: "user_id와 password는 필수입니다.",
    });
  }

  let conn;

  try {
    // 2) DB 연결
    conn = await getConnection();

    // 3) user_id 기반으로 사용자 조회
    const sql = `
      SELECT 
        user_id,
        password_hash,
        nickname,
        school_id,
        created_at
      FROM USER_ACCOUNT
      WHERE user_id = :id
    `;

    const result = await conn.execute(
      sql,
      { id: user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // user_id에 해당하는 사용자가 없음
    if (result.rows.length === 0) {
      return res.status(401).json({
        errorCode: "AUTH_INVALID_CREDENTIALS",
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const row = result.rows[0];

    // 4) 비밀번호 비교
    if (password !== row.PASSWORD_HASH) {
      return res.status(401).json({
        errorCode: 'AUTH_INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    // 5) 로그인 성공 → 프론트에 필요한 최소 정보만 반환
    const mockToken = "mock-access-token-1234"; // 나중에 JWT로 교체

    return res.json({
      accessToken: mockToken,
      user: {
        user_id: row.USER_ID,
        nickname: row.NICKNAME,
        school_id: row.SCHOOL_ID,
        created_at: row.CREATED_AT,
      },
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "서버 오류가 발생했습니다.",
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {}
    }
  }
});

// ✅ 이 한 줄이 정말 중요하다!
export default router;
