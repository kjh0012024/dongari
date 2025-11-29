// back/src/routes/school.js
import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../db.js";

const router = Router();

// GET /schools
router.get("/", async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const sql = `
      SELECT NAME
      FROM SCHOOL
      ORDER BY NAME ASC
    `;

    const result = await conn.execute(sql, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const schools = result.rows.map(row => row.NAME);

    return res.json({
      schools,  // ['경북대학교', '서울대학교', ...]
    });
  } catch (err) {
    console.error("[GET /schools ERROR]", err);
    return res.status(500).json({
      message: "학교 목록을 불러오는 중 오류가 발생했습니다.",
    });
  } finally {
    if (conn) {
      try { await conn.close(); } catch (e) {}
    }
  }
});

export default router;
