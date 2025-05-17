import {
    generateWorldview,
    generateCharacters,
    generateEpisode,
} from '../services/aiService.js';

import logger from '../utils/logger.js';

export const generateWorldviewHandler = async (req, res) => {
    try {
        const { title, genre, keywords } = req.body;

        if (!title || !genre || !Array.isArray(keywords)) {
            return res
                .status(400)
                .json({ message: 'title, genre, keywords[]는 필수입니다.' });
        }

        const result = await generateWorldview({ title, genre, keywords });

        return res.json({
            message: 'AI 세계관 생성 완료',
            result,
        });
    } catch (err) {
        logger.error(`AI 세계관 생성 실패: ${err.message}`);
        return res.status(500).json({ message: 'AI 요청 실패' });
    }
};

export const generateCharacterHandler = async (req, res) => {
    try {
        const { title, genre, keywords } = req.body;

        if (!title || !genre || !Array.isArray(keywords)) {
            return res
                .status(400)
                .json({ message: 'title, genre, keywords[]는 필수입니다.' });
        }

        const result = await generateCharacters({ title, genre, keywords });

        return res.json({
            message: 'AI 캐릭터 생성 완료',
            result,
        });
    } catch (err) {
        logger.error(`AI 캐릭터 생성 실패: ${err.message}`);
        return res.status(500).json({ message: 'AI 요청 실패' });
    }
};

export const generateEpisodeHandler = async (req, res) => {
    try {
        const {
            title,
            genre,
            episode_number,
            prompt,
            min_length,
            worldview,
            characters,
        } = req.body;

        if (
            !title ||
            !genre ||
            !episode_number ||
            !prompt ||
            !min_length ||
            !worldview ||
            !characters
        ) {
            return res
                .status(400)
                .json({ message: '필수 입력값이 누락되었습니다.' });
        }

        const content = await generateEpisode({
            title,
            genre,
            episode_number,
            prompt,
            min_length,
            worldview,
            characters,
        });

        return res.json({
            message: 'AI 에피소드 생성 완료',
            content,
        });
    } catch (err) {
        logger.error(`AI 에피소드 생성 실패: ${err.message}`);
        return res.status(500).json({ message: 'AI 요청 실패' });
    }
};
