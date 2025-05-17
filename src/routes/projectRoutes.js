import express from 'express';
import {
    createProject,
    getProject,
    getAllProjects,
    updateProject,
    deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:projectId', getProject);
router.patch('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

export default router;
