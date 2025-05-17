import express from 'express';
import {
    createCharacter,
    getCharactersByProject,
    updateCharacter,
    deleteCharacter,
} from '../controllers/characterController.js';

const router = express.Router();

router.post('/:projectId', createCharacter); // 생성
router.get('/project/:projectId', getCharactersByProject); // 목록 조회
router.patch('/:characterId', updateCharacter); // 수정
router.delete('/:characterId', deleteCharacter); // 삭제

export default router;
