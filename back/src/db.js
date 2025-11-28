import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

let pool;

export async function initDB() {
  try {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1,
    });
    console.log("[DB] Oracle connection pool created ✅");
  } catch (err) {
    console.error("[DB] Failed to create pool ❌", err);
    throw err;
  }
}

export async function closeDB() {
  try {
    if (pool) {
      await pool.close(0);
      console.log("[DB] Oracle connection pool closed ✅");
    }
  } catch (err) {
    console.error("[DB] Failed to close pool ❌", err);
  }
}

export async function getConnection() {
  if (!pool) {
    throw new Error("DB pool is not initialized. Call initDB() first.");
  }
  return pool.getConnection();
}