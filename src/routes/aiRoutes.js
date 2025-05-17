import express from 'express';
import {
    generateWorldviewHandler,
    generateCharacterHandler,
    generateEpisodeHandler,
} from '../controllers/aiController.js';

const router = express.Router();

// 세계관 생성
router.post('/worldview', generateWorldviewHandler);

// 캐릭터 생성
router.post('/characters', generateCharacterHandler);

// 에피소드 생성
router.post('/episode', generateEpisodeHandler);

export default router;
