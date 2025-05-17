import express from 'express';
import {
  createEpisode,
  getEpisode,
  getAllEpisodes,
  updateEpisode,
  deleteEpisode
} from '../controllers/episodeController.js';

const router = express.Router();

router.post('/:projectId', createEpisode); // 회차 생성
router.get('/:projectId', getAllEpisodes); // 프로젝트의 전체 회차
router.get('/:projectId/:episodeNumber', getEpisode); // 특정 회차
router.patch('/:episodeId', updateEpisode); // 회차 수정
router.delete('/:episodeId', deleteEpisode); // 회차 삭제

export default router;
