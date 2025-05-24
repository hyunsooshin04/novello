import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const aiModel = 'gpt-4.1-mini';

export async function generateWorldview({ title, genre, keywords }) {
    const prompt = `
        당신은 세계관 디자이너입니다. 아래 정보를 바탕으로 소설의 세계관을 구성해 주세요.

        - 제목: ${title}
        - 장르: ${genre}
        - 키워드: ${keywords.join(', ')}

        다음 형식으로 작성해주세요:

        1. worldview_summary (500자 이내)
        2. background
        3. history
        4. power
        5. myth
        `;

    const completion = await openai.chat.completions.create({
        // model: 'gpt-4',
        model: aiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    const { content } = completion.choices[0].message;
    const [summaryBlock, ...rest] = content.split(/\d\./).map((s) => s.trim());
    const data = {
        worldview_summary: summaryBlock,
        background: '',
        history: '',
        power: '',
        myth: '',
    };

    rest.forEach((part) => {
        if (part.toLowerCase().startsWith('background'))
            data.background = part.replace(/^background[:-]*/i, '').trim();
        else if (part.toLowerCase().startsWith('history'))
            data.history = part.replace(/^history[:-]*/i, '').trim();
        else if (part.toLowerCase().startsWith('power'))
            data.power = part.replace(/^power[:-]*/i, '').trim();
        else if (part.toLowerCase().startsWith('myth'))
            data.myth = part.replace(/^myth[:-]*/i, '').trim();
    });

    return data;
}

export async function generateCharacters({ title, genre, keywords }) {
    const prompt = `
        당신은 소설 설정을 돕는 캐릭터 디자이너입니다.
        다음 정보를 바탕으로 주요 등장인물 3명을 작성해주세요.

        - 제목: ${title}
        - 장르: ${genre}
        - 키워드: ${keywords.join(', ')}

        각 인물은 아래 형식을 따릅니다:

        이름: xxx  
        역할: xxx  
        설명: xxx

        3명 정도로 출력해주세요.
        `;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const characterList = text.split(/\n\s*\n/).map((block) => {
        const lines = block.trim().split('\n');
        const char = {};
        lines.forEach((line) => {
            if (line.startsWith('이름:'))
                char.name = line.replace('이름:', '').trim();
            if (line.startsWith('역할:'))
                char.role = line.replace('역할:', '').trim();
            if (line.startsWith('설명:'))
                char.description = line.replace('설명:', '').trim();
        });
        return char;
    });

    return characterList.filter((c) => c.name && c.role && c.description);
}

// export async function generateEpisode({
//     title,
//     genre,
//     episode_number,
//     prompt,
//     min_length,
//     worldview,
//     characters,
// }) {
//     const worldviewText = `배경: ${worldview.background}
//         역사: ${worldview.history}
//         질서: ${worldview.power}
//         신화: ${worldview.myth}`;

//     const characterText = characters
//         .map((c, i) => `${i + 1}. ${c.name} (${c.role}) - ${c.description}`)
//         .join('\n');

//     const fullPrompt = `
//         당신은 소설 작가입니다. 다음 설정을 바탕으로 ${min_length}자 이상의 ${episode_number}화 소설을 작성해주세요.

//         [제목] ${title}
//         [장르] ${genre}

//         [회차 프롬프트]
//         ${prompt}

//         [세계관]
//         ${worldviewText}

//         [등장인물]
//         ${characterText}

//         [소설 본문 시작]
//         `;

//     const completion = await openai.chat.completions.create({
//         model: 'gpt-4',
//         messages: [{ role: 'user', content: fullPrompt }],
//         temperature: 0.8,
//     });

//     return completion.choices[0].message.content.trim();
// }

export async function generateEpisode({
    title,
    genre,
    episode_number,
    prompt,
    min_length,
    worldview,
    characters,
    previous_episodes = [],
}) {
    const worldviewText = `배경: ${worldview.background}
  역사: ${worldview.history}
  질서: ${worldview.power}
  신화: ${worldview.myth}`;

    const characterText = characters
        .map((c, i) => `${i + 1}. ${c.name} (${c.role}) - ${c.description}`)
        .join('\n');

    const previousText =
        previous_episodes.length > 0
            ? previous_episodes
                  .map((ep) => `- [${ep.episode_number}화] ${ep.content}`)
                  .join('\n')
            : '없음';

    const basePrompt = `
        당신은 연재형 소설 작가입니다. 아래 내용을 바탕으로 ${min_length}자 이상의 회차를 작성하세요.
        
        [제목] ${title}
        [장르] ${genre}
        [현재 회차 프롬프트] ${prompt}
        
        [이전 회차 요약]
        ${previousText}
        
        [세계관]
        ${worldviewText}
        
        [등장인물]
        ${characterText}
        
        [소설 본문 시작]
        `;

    const initialRes = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: basePrompt }],
        temperature: 0.8,
    });

    let content = initialRes.choices[0].message.content.trim();
    const charCount = content.length;

    // 부족한 경우 이어서 요청
    if (charCount < min_length) {
        const remaining = min_length - charCount;

        const continuePrompt = `
            다음은 ${episode_number}화의 기존 소설 내용입니다. 이를 이어서 ${remaining}자 이상 자연스럽게 더 작성해 주세요.
            
            [기존 내용]
            ${content}
            `;

        const continueRes = await openai.chat.completions.create({
            // model: 'gpt-4',
            model: aiModel,
            messages: [{ role: 'user', content: continuePrompt }],
            temperature: 0.8,
        });

        const continuation = continueRes.choices[0].message.content.trim();
        content += '\n\n' + continuation;
    }

    return content;
}
