// back/src/routes/clubs.js
import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../db.js";

const router = Router();

// GET /clubs
router.get("/", async (req, res) => {
  const { schoolId, category } = req.query;
  const schoolIdNumber = schoolId ? Number(schoolId) : null;
  let conn;

  try {
    conn = await getConnection();

    const sql = `
      SELECT
        c.CLUB_ID AS ID,
        c.NAME AS NAME,
        s.NAME AS SCHOOL_NAME,
        c.CATEGORY AS CATEGORY,
        c.DESCRIPTION AS DESCRIPTION,
        c.PROFILE_IMAGE AS PROFILE_IMAGE
      FROM CLUB c
      JOIN SCHOOL s ON c.SCHOOL_ID = s.SCHOOL_ID
      WHERE (:schoolId IS NULL OR c.SCHOOL_ID = :schoolId)
        AND (:category IS NULL OR c.CATEGORY = :category)
      ORDER BY c.NAME
    `;

    const binds = {
      schoolId: Number.isNaN(schoolIdNumber) ? null : schoolIdNumber,
      category: category || null,
    };

    const result = await conn.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const clubs = result.rows.map(row => ({
      id: row.ID,
      name: row.NAME,
      schoolName: row.SCHOOL_NAME,
      category: row.CATEGORY,
      description: row.DESCRIPTION,
      profileImage: row.PROFILE_IMAGE,
    }));

    return res.json(clubs);
  } catch (err) {
    console.error("[GET /clubs ERROR]", err);
    return res.status(500).json({
      message: "동아리 목록을 불러오는 중 오류가 발생했습니다.",
    });
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) {}
    }
  }
});

export default router;
