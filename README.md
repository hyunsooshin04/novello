# 📘 Novello Studio – AI 소설 창작 플랫폼

Novello Studio는 사용자가 세계관, 캐릭터, 프롬프트만 설정하면 AI가 소설을 생성해주고, 사용자는 이를 편집 및 보완하여 완성도 높은 창작물을 만들어가는 플랫폼입니다.

---

## 🔧 기술 스택

- **Backend**: Node.js (ES Modules)
- **Database**: PostgreSQL 13+
- **Logger**: Winston + Daily Rotate File
- **Auth**: JWT + AES-GCM Payload Encryption
- **ORM/Query**: Custom SQL + `pg` 모듈

---

## 📂 주요 디렉터리 구조

```
src/
├── config/           # DB 및 환경설정
├── controllers/      # 요청 처리 로직
├── models/           # DB 쿼리 로직
├── routes/           # Express 라우터
├── utils/            # 공용 유틸리티 (JWT, logger 등)
└── server.js         # Express 진입점

```

---

## 🧱 DB 스키마 요약

### 1. `users`

- 사용자 정보

```sql=
user_id UUID PK
username, email (unique)
password (hashed)

```

### 2. `projects`

- 소설 프로젝트 메타 정보

```sql
project_id UUID PK
user_id UUID FK → users
title, genre, keywords[], worldview_summary
is_archived BOOLEAN

```

### 3. `worldviews`

- 각 프로젝트의 세계관 상세 설명

```sql
worldview_id UUID PK
project_id UUID FK → projects
background, history, power, myth

```

### 4. `characters`

- 등장인물 정보

```sql
character_id UUID PK
project_id UUID FK → projects
name, role, description
order_index INT

```

### 5. `episodes`

- 회차(에피소드) 내용

```sql
episode_id UUID PK
project_id UUID FK → projects
episode_number INT
prompt, min_length, content

```

---

## 🔐 인증 흐름

- `POST /api/auth/register`: 회원가입
- `POST /api/auth/login`: 로그인 → JWT(Access + Refresh) 반환
- `POST /api/auth/refresh`: Refresh 토큰으로 Access 재발급

> 모든 주요 API는 추후 인증 미들웨어로 보호될 수 있습니다.
> 

---

## 🚀 주요 API

| 기능 | 메서드 | 경로 |
| --- | --- | --- |
| 프로젝트 생성 | POST | `/api/projects` |
| 프로젝트 조회 | GET | `/api/projects/:projectId` |
| 프로젝트 수정 | PATCH | `/api/projects/:projectId` |
| 캐릭터 추가 | POST | `/api/characters/:projectId` |
| 캐릭터 조회 | GET | `/api/characters/project/:projectId` |
| 회차 작성 | POST | `/api/episodes/:projectId` |
| 회차 조회 | GET | `/api/episodes/:projectId/:episodeNumber` |

※ 전체 API 목록은 추후 Swagger/OpenAPI로 문서화 가능

---

## ⚙️ 실행 방법

### 1. `.env` 파일 설정

```
ini
복사편집
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=novello
JWT_SECRET=dev-secret-key
NODE_ENV=development

```

### 2. 설치 및 실행

```bash
npm install
node ./src/server.js

```

---

## 📌 향후 개선 예정

- [ ]  사용자별 인증 연동 (`req.user.user_id`)
- [ ]  회차 자동 넘버링 및 초안 저장
- [ ]  AI 연결 (OpenAI GPT 또는 커스텀 모델)
- [ ]  프로젝트 공유/복제 기능
- [ ]  Swagger 기반 API 문서화

---

## 📝 개발자 참고

- `logger.js`를 통해 모든 API 흐름이 `logs/YYYY-MM-DD.log`로 저장됩니다.
- 모든 DB 접근은 `exec(query, values)` 방식으로 통일하여 보안과 로깅을 강화했습니다.
- ESM 기반으로 `.js` 확장자는 import 시 반드시 포함해야 합니다.

```sql
CREATE TABLE projects (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 고유 식별자
  user_id UUID NOT NULL,                                 -- 작성자 (외래키 가능)
  title VARCHAR(255) NOT NULL,                           -- 프로젝트 제목
  genre VARCHAR(50),                                     -- 장르 (판타지, 로맨스 등)
  keywords TEXT[],                                       -- 키워드 배열 (PostgreSQL)
  worldview_summary TEXT,                                -- 세계관 요약 설명
  created_at TIMESTAMP DEFAULT NOW(),                    -- 생성일
  updated_at TIMESTAMP DEFAULT NOW(),                    -- 마지막 수정일
  is_archived BOOLEAN DEFAULT FALSE                      -- 보관 처리 여부
);

CREATE TABLE worldviews (
  worldview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 고유 식별자
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, -- 연결된 프로젝트 ID

  background TEXT,   -- 세계 배경
  history TEXT,      -- 세계 역사
  power TEXT,        -- 지배 체계 및 질서
  myth TEXT,         -- 신화 또는 세계관 규칙

  created_at TIMESTAMP DEFAULT NOW(),         -- 생성 시각
  updated_at TIMESTAMP DEFAULT NOW()          -- 마지막 수정 시각
);

CREATE TABLE characters (
  character_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- 캐릭터 고유 ID
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,  -- 소속 프로젝트

  name VARCHAR(100) NOT NULL,      -- 캐릭터 이름
  role VARCHAR(100),               -- 캐릭터 역할 (예: 주인공, 조력자 등)
  description TEXT,                -- 캐릭터 설명 (성격, 배경, 동기 등)

  order_index INT DEFAULT 0,       -- 캐릭터 정렬 순서
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE episodes (
  episode_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- 회차 고유 ID
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,  -- 소속 프로젝트

  episode_number INT NOT NULL,            -- 몇 화인지 (1, 2, 3…)
  prompt TEXT,                            -- 사용자가 입력한 프롬프트 (회차 방향성)
  min_length INT DEFAULT 300,             -- 최소 글자 수 조건
  content TEXT,                           -- 생성된 회차 내용 (소설 본문)

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


```