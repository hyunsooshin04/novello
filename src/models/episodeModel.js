import exec from '../config/db.js';

const EpisodeModel = {
    async create({ project_id, episode_number, prompt, min_length, content }) {
        const result = await exec(
            `INSERT INTO episodes (project_id, episode_number, prompt, min_length, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [project_id, episode_number, prompt, min_length, content],
        );
        return result.rows[0];
    },

    async findByNumber(project_id, episode_number) {
        const result = await exec(
            `SELECT * FROM episodes WHERE project_id = $1 AND episode_number = $2`,
            [project_id, episode_number],
        );
        return result.rows[0];
    },

    async findAllByProject(project_id) {
        const result = await exec(
            `SELECT * FROM episodes WHERE project_id = $1 ORDER BY episode_number ASC`,
            [project_id],
        );
        return result.rows;
    },

    async update(episode_id, { prompt, min_length, content }) {
        const result = await exec(
            `UPDATE episodes
       SET prompt = $1,
           min_length = $2,
           content = $3,
           updated_at = NOW()
       WHERE episode_id = $4
       RETURNING *`,
            [prompt, min_length, content, episode_id],
        );
        return result.rows[0];
    },

    async delete(episode_id) {
        const result = await exec(
            `DELETE FROM episodes WHERE episode_id = $1 RETURNING *`,
            [episode_id],
        );
        return result.rows[0];
    },
};

export default EpisodeModel;
