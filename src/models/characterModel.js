import exec from '../config/db.js';

const CharacterModel = {
    async create({ project_id, name, role, description, order_index = 0 }) {
        const result = await exec(
            `INSERT INTO characters (project_id, name, role, description, order_index)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [project_id, name, role, description, order_index],
        );
        return result.rows[0];
    },

    async findByProject(project_id) {
        const result = await exec(
            `SELECT * FROM characters
       WHERE project_id = $1
       ORDER BY order_index ASC, created_at ASC`,
            [project_id],
        );
        return result.rows;
    },

    async update(character_id, { name, role, description, order_index }) {
        const result = await exec(
            `UPDATE characters
       SET name = $1,
           role = $2,
           description = $3,
           order_index = $4,
           updated_at = NOW()
       WHERE character_id = $5
       RETURNING *`,
            [name, role, description, order_index, character_id],
        );
        return result.rows[0];
    },

    async delete(character_id) {
        const result = await exec(
            `DELETE FROM characters WHERE character_id = $1 RETURNING *`,
            [character_id],
        );
        return result.rows[0];
    },
};

export default CharacterModel;
