import exec from '../config/db.js';

const ProjectModel = {
    async create({ user_id, title, genre, keywords, worldview_summary }) {
        const result = await exec(
            `INSERT INTO projects (user_id, title, genre, keywords, worldview_summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [user_id, title, genre, keywords, worldview_summary],
        );
        return result.rows[0];
    },

    async findById(project_id) {
        const result = await exec(
            `SELECT * FROM projects WHERE project_id = $1`,
            [project_id],
        );
        return result.rows[0];
    },

    async findAllByUser(user_id) {
        const result = await exec(
            `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id],
        );
        return result.rows;
    },

    async update(
        project_id,
        { title, genre, keywords, worldview_summary, is_archived },
    ) {
        const result = await exec(
            `UPDATE projects
       SET title = $1,
           genre = $2,
           keywords = $3,
           worldview_summary = $4,
           is_archived = $5,
           updated_at = NOW()
       WHERE project_id = $6
       RETURNING *`,
            [
                title,
                genre,
                keywords,
                worldview_summary,
                is_archived,
                project_id,
            ],
        );
        return result.rows[0];
    },

    async delete(project_id) {
        const result = await exec(
            `DELETE FROM projects WHERE project_id = $1 RETURNING *`,
            [project_id],
        );
        return result.rows[0];
    },
};

export default ProjectModel;
