// back/src/routes/auth.js
import { Router } from "express";
import oracledb from "oracledb";
//import bcrypt from "bcrypt";
import { getConnection } from "../db.js";

const router = Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1) 필수 필드 체크
  if (!email || !password) {
    return res.status(400).json({
      errorCode: "AUTH_REQUIRED_FIELDS",
      message: "id와 password는 필수입니다.",
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
        email,
        password_hash,
        nickname,
        school_id,
        created_at
      FROM USER_ACCOUNT
      WHERE email = :email
    `;

    const result = await conn.execute(
      sql,
      { email },
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
        email: row.EMAIL,
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

router.post("/register", async (req, res) => {
  const { email, password, school } = req.body; // 🔹 school 추가

  if (!email || !password || !school) {
    return res.status(400).json({
      success: false,
      errorCode: "AUTH_REQUIRED_FIELDS",
      message: "email, password, school은 필수입니다.",
    });
  }

  let conn;

  try {
    conn = await getConnection();

    // 1) 이메일 중복 체크 (이전과 동일)
    const checkSql = `
      SELECT COUNT(*) AS CNT
      FROM USER_ACCOUNT
      WHERE email = :email
    `;
    const checkResult = await conn.execute(
      checkSql,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (checkResult.rows[0].CNT > 0) {
      return res.status(409).json({
        success: false,
        errorCode: "AUTH_EMAIL_EXISTS",
        message: "이미 가입된 이메일입니다.",
      });
    }

    // 2) 학교 처리 방식에 따라 갈림

    // (A) SCHOOL 테이블이 있고, 이름으로 id를 찾는 경우 (권장)
    //     테이블 구조 예: SCHOOL(school_id, school_name)
    let schoolId = null;
    const schoolSql = `
      SELECT school_id
      FROM SCHOOL
      WHERE NAME = :name
    `;
    const schoolResult = await conn.execute(
      schoolSql,
      { name: school },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (schoolResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_SCHOOL",
        message: "존재하지 않는 학교입니다.",
      });
    }
    schoolId = schoolResult.rows[0].SCHOOL_ID;

    // 3) 비밀번호 해시 (지금은 평문)
    const hashed = password;

    // 4) IDENTITY 컬럼이므로 user_id는 쓰지 않음
    const insertSql = `
      INSERT INTO USER_ACCOUNT (
        email,
        password_hash,
        nickname,
        school_id,
        created_at
      )
      VALUES (
        :email,
        :password_hash,
        NULL,
        :school_id,
        SYSDATE
      )
    `;

    await conn.execute(
      insertSql,
      {
        email,
        password_hash: hashed,
        school_id: schoolId,  // 🔹 학교 id 저장
      },
      { autoCommit: true }
    );

    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
    });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return res.status(500).json({
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "서버 오류가 발생했습니다.",
    });
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) {}
    }
  }
});


export default router;
