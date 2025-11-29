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
        e.EVENT_ID   AS EVENT_ID,
        e.TITLE      AS TITLE,
        e.DESCRIPTION AS DESCRIPTION,
        e.START_TIME AS START_TIME,
        e.END_TIME   AS END_TIME,
        e.LOCATION   AS LOCATION,
        c.NAME       AS CLUB_NAME
      FROM EVENT e
      JOIN CLUB c ON e.CLUB_ID = c.CLUB_ID
      ORDER BY e.START_TIME DESC
    `;

    const result = await conn.execute(sql, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const events = result.rows.map(row => ({
      id: row.EVENT_ID?.toString?.() ?? "",
      title: row.TITLE ?? "",
      description: row.DESCRIPTION ?? "",
      club: row.CLUB_NAME ?? "",
      date: row.START_TIME
        ? new Date(row.START_TIME).toISOString().slice(0, 10)
        : "",
      endDate: row.END_TIME
        ? new Date(row.END_TIME).toISOString().slice(0, 10)
        : "",
      location: row.LOCATION ?? "",
      rawDate: row.START_TIME || null,
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
