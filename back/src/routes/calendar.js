// back/src/routes/calendar.js
import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../db.js";

const router = Router();

// GET /calendar/events - 모든 이벤트를 날짜별로 반환
router.get("/events", async (_req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const sql = `
      SELECT
        p.POST_ID AS POST_ID,
        p.TITLE AS TITLE,
        p.CONTENT AS CONTENT,
        p.CREATED_AT AS CREATED_AT,
        c.NAME AS CLUB_NAME
      FROM POST p
      JOIN CLUB c ON p.CLUB_ID = c.CLUB_ID
      ORDER BY p.CREATED_AT DESC
    `;

    const result = await conn.execute(sql, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const events = result.rows.map(row => ({
      id: row.POST_ID?.toString?.() ?? "",
      title: row.TITLE ?? "",
      description: row.CONTENT ?? "",
      club: row.CLUB_NAME ?? "",
      date: row.CREATED_AT
        ? new Date(row.CREATED_AT).toISOString().slice(0, 10)
        : "",
      rawDate: row.CREATED_AT || null,
    })).filter(event => event.date);

    return res.json(events);
  } catch (err) {
    console.error("[GET /calendar/events ERROR]", err);
    return res.status(500).json({
      message: "일정을 불러오는 중 오류가 발생했습니다.",
    });
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) {}
    }
  }
});

export default router;
