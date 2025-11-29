// back/src/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

//import { initDB, closeDB } from "./db.js";
import { initDB} from "./db.js";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";  // ✅ 로그인 라우터
import schoolRouter from "./routes/school.js";
import clubsRouter from "./routes/clubs.js";
import feedRouter from "./routes/feed.js";
import calendarRouter from "./routes/calendar.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 공통 미들웨어
app.use(cors());             // RN 앱에서 API 호출 허용
app.use(morgan("dev"));      // 요청 로그
app.use(express.json());     // JSON body 파싱

// 라우터 등록
app.use("/", indexRouter);        // 기본 라우트 (예: 헬스체크, 테스트용)
app.use("/auth", authRouter);     // ✅ 로그인 관련 라우트 (POST /auth/login)
app.use("/schools", schoolRouter);
app.use("/clubs", clubsRouter);
app.use("/feed", feedRouter);
app.use("/calendar", calendarRouter);

// 서버 시작 함수
async function startServer() {
  try {
    await initDB();  // ✅ DB 풀 생성
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (0.0.0.0)`);
    });
  } catch (err) {
    console.error("Failed to start server ❌", err);
    process.exit(1);
  }
}

// 종료 시 DB 정리
process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  //await closeDB();     // ✅ 커넥션 풀 정리
  process.exit(0);
});

startServer();
