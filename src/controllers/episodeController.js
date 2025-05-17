import EpisodeModel from '../models/episodeModel.js';
import logger from '../utils/logger.js';

export const createEpisode = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { episode_number, prompt, min_length, content } = req.body;

        if (!episode_number || !content) {
            return res
                .status(400)
                .json({ message: '회차 번호와 내용은 필수입니다.' });
        }

        const episode = await EpisodeModel.create({
            project_id: projectId,
            episode_number,
            prompt,
            min_length,
            content,
        });

        logger.info(`에피소드 작성: #${episode.episode_number}`);
        return res
            .status(201)
            .json({ message: '회차가 저장되었습니다.', episode });
    } catch (err) {
        logger.error(`에피소드 작성 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const getEpisode = async (req, res) => {
    try {
        const { projectId, episodeNumber } = req.params;

        const episode = await EpisodeModel.findByNumber(
            projectId,
            episodeNumber,
        );
        if (!episode) {
            return res
                .status(404)
                .json({ message: '회차를 찾을 수 없습니다.' });
        }

        return res.json({ episode });
    } catch (err) {
        logger.error(`에피소드 조회 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const getAllEpisodes = async (req, res) => {
    try {
        const { projectId } = req.params;
        const episodes = await EpisodeModel.findAllByProject(projectId);
        return res.json({ episodes });
    } catch (err) {
        logger.error(`회차 목록 조회 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const updateEpisode = async (req, res) => {
    try {
        const { episodeId } = req.params;
        const { prompt, min_length, content } = req.body;

        const updated = await EpisodeModel.update(episodeId, {
            prompt,
            min_length,
            content,
        });

        if (!updated) {
            return res
                .status(404)
                .json({ message: '회차를 찾을 수 없습니다.' });
        }

        return res.json({
            message: '회차가 수정되었습니다.',
            episode: updated,
        });
    } catch (err) {
        logger.error(`에피소드 수정 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const deleteEpisode = async (req, res) => {
    try {
        const { episodeId } = req.params;

        const deleted = await EpisodeModel.delete(episodeId);
        if (!deleted) {
            return res
                .status(404)
                .json({ message: '회차를 찾을 수 없습니다.' });
        }

        return res.json({
            message: '회차가 삭제되었습니다.',
            episode: deleted,
        });
    } catch (err) {
        logger.error(`에피소드 삭제 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};
