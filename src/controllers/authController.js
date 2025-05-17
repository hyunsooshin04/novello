import bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js';
import logger from '../utils/logger.js';
import jwtService from '../utils/jwt.js';

export const register = async (req, res) => {
    try {
        console.log('회원가입 요청:', req.body);
        const { username, email, password } = req.body;

        const existing = await UserModel.findByEmail(email);
        if (existing) {
            logger.warn(`이메일 중복: ${email}`);
            return res
                .status(400)
                .json({ message: '이미 가입된 이메일입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            username,
            email,
            hashedPassword,
        });

        logger.info(`회원가입 성공: ${email}`);

        // 회원가입 후 즉시 토큰 발급
        const payload = { user_id: user.user_id, email: user.email };
        const accessToken = jwtService.generateAccessToken(payload);
        const refreshToken = jwtService.generateRefreshToken(payload);

        return res.status(201).json({
            message: '회원가입 성공',
            accessToken,
            refreshToken,
        });
    } catch (err) {
        logger.error(`회원가입 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if (!user) {
            logger.warn(`로그인 실패 - 이메일 없음: ${email}`);
            return res
                .status(401)
                .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn(`로그인 실패 - 비밀번호 불일치: ${email}`);
            return res
                .status(401)
                .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        logger.info(`로그인 성공: ${email}`);

        const payload = { user_id: user.user_id, email: user.email };
        const accessToken = jwtService.generateAccessToken(payload);
        const refreshToken = jwtService.generateRefreshToken(payload);

        return res.json({
            message: '로그인 성공',
            accessToken,
            refreshToken,
        });
    } catch (err) {
        logger.error(`로그인 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res
                .status(400)
                .json({ message: 'Refresh 토큰이 필요합니다.' });
        }

        let payload;
        try {
            payload = jwtService.decodeToken(refreshToken);
        } catch (err) {
            logger.warn(`Refresh 토큰 검증 실패: ${err.message}`);
            return res
                .status(401)
                .json({ message: '유효하지 않은 토큰입니다.' });
        }

        if (payload.type !== 'refresh') {
            logger.warn(`잘못된 토큰 타입: ${payload.type}`);
            return res
                .status(400)
                .json({ message: 'Refresh 토큰이 아닙니다.' });
        }

        const newAccessToken = jwtService.generateAccessToken({
            user_id: payload.user_id,
            email: payload.email,
        });

        return res.json({
            message: 'Access 토큰 재발급 성공',
            accessToken: newAccessToken,
        });
    } catch (err) {
        logger.error(`Access 토큰 재발급 실패: ${err.message}`);
        return res.status(500).json({ message: '서버 오류' });
    }
};
