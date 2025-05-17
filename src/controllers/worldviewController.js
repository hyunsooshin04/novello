import WorldviewModel from '../models/worldviewModel.js';
import logger from '../utils/logger.js';

// 저장
export const createWorldview = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { background, history, power, myth } = req.body;

        const worldview = await WorldviewModel.create({
            project_id: projectId,
            background,
            history,
            power,
            myth,
        });

        return res.status(201).json({ message: '세계관 저장 완료', worldview });
    } catch (err) {
        logger.error(`세계관 저장 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 조회
export const getWorldviewByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const worldview = await WorldviewModel.findByProjectId(projectId);
        if (!worldview) {
            return res
                .status(404)
                .json({ message: '세계관이 존재하지 않습니다.' });
        }
        return res.json({ worldview });
    } catch (err) {
        logger.error(`세계관 조회 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 수정
export const updateWorldview = async (req, res) => {
    try {
        const { worldviewId } = req.params;
        const { background, history, power, myth } = req.body;

        const updated = await WorldviewModel.update(worldviewId, {
            background,
            history,
            power,
            myth,
        });

        return res.json({ message: '세계관 수정 완료', updated });
    } catch (err) {
        logger.error(`세계관 수정 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};
