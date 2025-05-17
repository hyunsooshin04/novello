import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class JwtService {
    constructor() {
        // 32바이트 (256비트) 길이의 ENCRYPTION_KEY와 12바이트 (96비트) 길이의 IV 생성
        if (process.env.NODE_ENV === 'production') {
            this.secretKey = crypto.randomBytes(64).toString('hex'); // Access 및 Refresh Token에 사용할 서명 키
            this.encryptionKey = crypto.randomBytes(32); // 32 bytes = 256 bits for AES-256
            this.iv = crypto.randomBytes(12); // 12 bytes = 96 bits for GCM IV (recommended size)
        } else {
            this.secretKey = 'fixed-secret-key-for-development'; // 서명 키 고정값
            this.encryptionKey = Buffer.from(
                '12345678901234567890123456789012',
            ); // 32 bytes 고정값 (AES-256)
            this.iv = Buffer.from('123456789012'); // 12 bytes 고정값 (GCM IV)
        }
        console.log('Secret Key:', this.secretKey);
        console.log('Encryption Key:', this.encryptionKey.toString('hex'));
        console.log('IV:', this.iv.toString('hex'));
    }

    // AES-GCM 암호화 함수
    encryptPayload(payload) {
        console.log('encrypt encryptionKey :', this.encryptionKey);
        console.log('encrypt iv :', this.iv);
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            this.encryptionKey,
            this.iv,
        );
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // GCM 모드에서는 추가적인 인증 태그가 생성됨
        const authTag = cipher.getAuthTag().toString('hex');

        // 암호문과 태그를 함께 반환
        return {
            encryptedData: encrypted,
            authTag,
        };
    }

    // AES-GCM 복호화 함수
    decryptPayload(encryptedPayload) {
        const { encryptedData, authTag } = encryptedPayload;

        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            this.encryptionKey,
            this.iv,
        );
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    // 엑세스 토큰 발급 (iat, exp 포함 및 type 추가)
    generateAccessToken(payload) {
        console.log('payload : ', payload);
        const iat = Math.floor(Date.now() / 1000); // 발급 시간 (초 단위)
        const exp = iat + 60 * 60; // 1시간 후 만료

        // type 필드로 구분 (access 토큰)
        const fullPayload = {
            ...payload,
            iat,
            exp,
            type: 'access', // Access 토큰으로 구분
        };

        const encryptedPayload = this.encryptPayload(fullPayload); // 전체 페이로드 암호화

        // 암호화된 페이로드를 JWT 서명과 함께 발급
        return jwt.sign(
            { data: encryptedPayload, iat, exp, type: 'access' },
            this.secretKey,
            {
                noTimestamp: true, // iat 자동 추가 방지
            },
        );
    }

    // 리프레시 토큰 발급 (iat, exp 포함 및 type 추가)
    generateRefreshToken(payload) {
        const iat = Math.floor(Date.now() / 1000); // 발급 시간 (초 단위)
        const exp = iat + 60 * 60 * 24 * 7; // 7일 후 만료

        // type 필드로 구분 (refresh 토큰)
        const fullPayload = {
            ...payload,
            iat,
            exp,
            type: 'refresh', // Refresh 토큰으로 구분
        };

        const encryptedPayload = this.encryptPayload(fullPayload); // 전체 페이로드 암호화

        // 암호화된 페이로드를 JWT 서명과 함께 발급
        return jwt.sign(
            { data: encryptedPayload, iat, exp, type: 'refresh' },
            this.secretKey,
            {
                noTimestamp: true, // iat 자동 추가 방지
            },
        );
    }

    // 토큰 검증 및 복호화 (내부 함수)
    verifyAndDecryptToken(token) {
        try {
            // JWT 서명 검증
            const decoded = jwt.verify(token, this.secretKey);
            // 암호화된 데이터 복호화
            const decryptedData = this.decryptPayload(decoded.data);
            // 유효 기간 검사 (exp 확인)
            const currentTime = Math.floor(Date.now() / 1000);
            if (decryptedData.exp && decryptedData.exp < currentTime) {
                throw new Error('Token has expired');
            }
            return decryptedData;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    // 엑세스 토큰 또는 리프레시 토큰의 복호화 및 검증 처리
    decodeToken(token) {
        const decryptedData = this.verifyAndDecryptToken(token);

        // 토큰 타입에 따라 처리
        if (decryptedData.type === 'access') {
            console.log('This is an Access Token.');
        } else if (decryptedData.type === 'refresh') {
            console.log('This is a Refresh Token.');
        } else {
            throw new Error('Invalid token type');
        }

        return decryptedData;
    }
}

export default new JwtService();
