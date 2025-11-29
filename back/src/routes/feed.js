// back/src/routes/feed.js
import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../db.js";

const router = Router();

// GET /feed - fetch posts from all clubs
router.get("/", async (_req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const sql = `
      SELECT
        p.POST_ID AS POST_ID,
        p.CLUB_ID AS CLUB_ID,
        c.NAME AS CLUB_NAME,
        p.TITLE AS TITLE,
        p.CONTENT AS CONTENT,
        p.CREATED_AT AS CREATED_AT
      FROM POST p
      JOIN CLUB c ON p.CLUB_ID = c.CLUB_ID
      ORDER BY p.CREATED_AT DESC
    `;

    const result = await conn.execute(sql, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const posts = result.rows.map(row => ({
      id: row.POST_ID?.toString() ?? "",
      clubId: row.CLUB_ID,
      clubName: row.CLUB_NAME,
      title: row.TITLE,
      content: row.CONTENT,
      createdAt: row.CREATED_AT,
    }));

    return res.json(posts);
  } catch (err) {
    console.error("[GET /feed ERROR]", err);
    return res.status(500).json({
      message: "피드를 불러오는 중 오류가 발생했습니다.",
    });
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) {}
    }
  }
});

export default router;
