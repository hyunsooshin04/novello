import express from 'express';
import {
    createWorldview,
    getWorldviewByProjectId,
    updateWorldview,
} from '../controllers/worldviewController.js';

const router = express.Router();

router.post('/:projectId', createWorldview); // 저장
router.get('/:projectId', getWorldviewByProjectId); // 조회
router.patch('/:worldviewId', updateWorldview); // 수정

export default router;
