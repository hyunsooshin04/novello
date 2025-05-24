import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import logger from './utils/logger.js';

// 라우터
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import episodeRoutes from './routes/episodeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import worldviewRoutes from './routes/worldviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 기본 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
app.use('/api/auth', authRoutes); // 회원가입 / 로그인 / 토큰 재발급
app.use('/api/projects', projectRoutes); // 프로젝트 관리
app.use('/api/characters', characterRoutes); // 캐릭터 관리
app.use('/api/episodes', episodeRoutes); // 에피소드 관리
app.use('/api/ai', aiRoutes); // AI 자동 생성 (세계관, 캐릭터, 회차)
app.use('/api/worldviews', worldviewRoutes); // 세계관 관리

// 상태 확인
app.get('/', (req, res) => {
    res.send('Novello Studio API Server is running');
});

// 예외 처리
app.use((err, req, res, next) => {
    logger.error(`Unhandled Error: ${err.message}`);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
});
