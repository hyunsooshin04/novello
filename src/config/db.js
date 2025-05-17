import pkg from 'pg';
import { config } from 'dotenv';
import logger from '../utils/logger.js';

config();

const { Pool } = pkg;

let pool;
let reconnect;
let isReconnecting = false;

function createPool() {
    pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    pool.on('error', (err) => {
        logger.error(`PostgreSQL Pool Error: ${err.message}`);
        reconnect();
    });

    logger.info('✅ PostgreSQL 연결됨');
}

reconnect = () => {
    if (isReconnecting) return;
    isReconnecting = true;

    pool.end()
        .then(() => {
            logger.warn('기존 Pool 종료');
            createPool();
        })
        .catch((err) => {
            logger.error(`Pool 종료 실패: ${err.message}`);
        })
        .finally(() => {
            isReconnecting = false;
        });
};

createPool();

export default async function exec(query, values = []) {
    const client = await pool.connect();
    try {
        logger.debug(`SQL 실행: ${query}`);
        logger.debug(`Values: ${JSON.stringify(values)}`);

        const result = await client.query(query, values);
        return result;
    } catch (err) {
        logger.error(`Query Error: ${err.message}`);
        throw err;
    } finally {
        client.release();
    }
}
