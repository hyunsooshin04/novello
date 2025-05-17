import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;

// 여기서 timestamp 이름이 이미 쓰였기 때문에 구조분해 이름을 바꿔줌
const logFormat = printf(({ level, message, timestamp: ts }) => {
    return `${ts} [${level}]: ${message}`;
});

const dailyRotateFileTransport = new DailyRotateFile({
    filename: 'logs/%DATE%.log', // 로그 파일 이름 (날짜별로 파일 생성)
    datePattern: 'YYYY-MM-DD', // 파일 이름에 사용할 날짜 형식
    maxFiles: '14d', // 14일 동안의 로그 파일을 보관
    zippedArchive: true, // 로그 파일을 압축하여 보관
});

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // winston.format.timestamp
        colorize(),
        logFormat,
    ),
    transports: [new transports.Console(), dailyRotateFileTransport],
});

if (process.env.NODE_ENV === 'development') {
    logger.level = 'debug';
}

export default logger;
