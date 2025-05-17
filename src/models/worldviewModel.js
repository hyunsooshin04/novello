import exec from '../config/db.js';

const WorldviewModel = {
    create: async ({ project_id, background, history, power, myth }) => {
        const result = await exec(
            `
      INSERT INTO worldviews (project_id, background, history, power, myth)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
            [project_id, background, history, power, myth],
        );
        return result.rows[0];
    },

    findByProjectId: async (project_id) => {
        const result = await exec(
            `SELECT * FROM worldviews WHERE project_id = $1 LIMIT 1`,
            [project_id],
        );
        return result.rows[0];
    },

    update: async (worldview_id, { background, history, power, myth }) => {
        const result = await exec(
            `
      UPDATE worldviews
      SET background = $1,
          history = $2,
          power = $3,
          myth = $4,
          updated_at = NOW()
      WHERE worldview_id = $5
      RETURNING *
      `,
            [background, history, power, myth, worldview_id],
        );
        return result.rows[0];
    },
};

export default WorldviewModel;
