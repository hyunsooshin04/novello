import exec from '../config/db.js';

const UserModel = {
    async create({ username, email, hashedPassword }) {
        const result = await exec(
            `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3) RETURNING *`,
            [username, email, hashedPassword],
        );
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await exec('SELECT * FROM users WHERE email = $1', [
            email,
        ]);
        return result.rows[0];
    },
};

export default UserModel;
