// back/src/routes/index.js
import { Router } from "express";

const router = Router();

// 헬스 체크용
router.get("/", (req, res) => {
  res.send("Dongari backend is running 👋");
});

export default router;
