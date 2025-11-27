import express from "express";
import { getConnection } from "../db.js";

const router = express.Router();

// 헬스 체크: 서버 살아있는지 확인
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// DB 연결 테스트
router.get("/test-db", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute("SELECT 'OK' AS status FROM DUAL");
    res.json({
      db: "connected",
      result: result.rows,
    });
  } catch (err) {
    console.error("[DB] test error", err);
    res.status(500).json({ db: "error", message: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("[DB] close error", e);
      }
    }
  }
});

export default router;
