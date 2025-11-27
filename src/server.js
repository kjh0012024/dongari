import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { initDB, closeDB } from "./db.js";
import indexRouter from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 공통 미들웨어
app.use(cors());             // RN 앱에서 API 부를 수 있게
app.use(morgan("dev"));      // 로그
app.use(express.json());     // JSON body 파싱

// 기본 라우터
app.use("/", indexRouter);

// 서버 시작 함수
async function startServer() {
  try {
    await initDB();  // DB 풀 생성
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server ❌", err);
    process.exit(1);
  }
}

// 종료 시 DB 정리
process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  await closeDB();
  process.exit(0);
});

startServer();
