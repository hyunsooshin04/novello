import CharacterModel from '../models/characterModel.js';
import logger from '../utils/logger.js';

export const createCharacter = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, role, description, order_index } = req.body;

        if (!name || !projectId) {
            return res
                .status(400)
                .json({ message: '프로젝트 ID와 이름은 필수입니다.' });
        }

        const character = await CharacterModel.create({
            project_id: projectId,
            name,
            role,
            description,
            order_index,
        });

        logger.info(`캐릭터 생성: ${character.character_id}`);

        return res.status(201).json({
            message: '캐릭터가 저장되었습니다.',
            character,
        });
    } catch (err) {
        logger.error(`캐릭터 생성 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const getCharactersByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const characters = await CharacterModel.findByProject(projectId);
        return res.json({ characters });
    } catch (err) {
        logger.error(`캐릭터 목록 조회 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const updateCharacter = async (req, res) => {
    try {
        const { characterId } = req.params;
        const { name, role, description, order_index } = req.body;

        const updated = await CharacterModel.update(characterId, {
            name,
            role,
            description,
            order_index,
        });

        if (!updated) {
            return res
                .status(404)
                .json({ message: '캐릭터를 찾을 수 없습니다.' });
        }

        return res.json({
            message: '캐릭터가 수정되었습니다.',
            character: updated,
        });
    } catch (err) {
        logger.error(`캐릭터 수정 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const deleteCharacter = async (req, res) => {
    try {
        const { characterId } = req.params;

        const deleted = await CharacterModel.delete(characterId);
        if (!deleted) {
            return res
                .status(404)
                .json({ message: '캐릭터를 찾을 수 없습니다.' });
        }

        return res.json({
            message: '캐릭터가 삭제되었습니다.',
            character: deleted,
        });
    } catch (err) {
        logger.error(`캐릭터 삭제 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};
