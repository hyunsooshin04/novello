import ProjectModel from '../models/projectModel.js';
import logger from '../utils/logger.js';

export const createProject = async (req, res) => {
    try {
        const { title, genre, keywords, worldview_summary } = req.body;

        if (!title) {
            return res
                .status(400)
                .json({ message: '프로젝트 제목은 필수입니다.' });
        }

        const user_id = '00000000-0000-0000-0000-000000000001';

        const project = await ProjectModel.create({
            user_id,
            title,
            genre,
            keywords,
            worldview_summary,
        });

        logger.info(`프로젝트 생성 완료: ${project.project_id}`);
        return res
            .status(201)
            .json({ message: '프로젝트가 생성되었습니다.', project });
    } catch (err) {
        logger.error(`프로젝트 생성 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res
                .status(404)
                .json({ message: '프로젝트를 찾을 수 없습니다.' });
        }

        return res.json({ project });
    } catch (err) {
        logger.error(`프로젝트 조회 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const user_id = '00000000-0000-0000-0000-000000000001'; // 실제 로그인 사용자
        const projects = await ProjectModel.findAllByUser(user_id);
        return res.json({ projects });
    } catch (err) {
        logger.error(`프로젝트 목록 조회 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, genre, keywords, worldview_summary, is_archived } =
            req.body;

        const updated = await ProjectModel.update(projectId, {
            title,
            genre,
            keywords,
            worldview_summary,
            is_archived,
        });

        if (!updated) {
            return res
                .status(404)
                .json({ message: '프로젝트를 찾을 수 없습니다.' });
        }

        return res.json({
            message: '프로젝트가 수정되었습니다.',
            project: updated,
        });
    } catch (err) {
        logger.error(`프로젝트 수정 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const deleted = await ProjectModel.delete(projectId);

        if (!deleted) {
            return res
                .status(404)
                .json({ message: '프로젝트를 찾을 수 없습니다.' });
        }

        return res.json({
            message: '프로젝트가 삭제되었습니다.',
            project: deleted,
        });
    } catch (err) {
        logger.error(`프로젝트 삭제 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};
