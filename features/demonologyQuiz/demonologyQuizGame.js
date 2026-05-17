const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');
const SCORES_FILE = path.join(__dirname, 'data', 'scores.json');
const ACTIVE_DURATION_MS = 30_000;
const CORRECT_REWARD_POINTS = 30;
const CORRECT_MONEY_REWARD = 100;
const TITLE_STAGES = [
    { name: 'Novice Hunter', minPoints: 0 },
    { name: 'Salt Reader', minPoints: 100 },
    { name: 'Entity Tracker', minPoints: 250 },
    { name: 'Exorcist', minPoints: 500 },
    { name: 'Demonologist', minPoints: 900 }
];

const activeQuizzes = new Map();
const recentQuestionIds = [];
let lastQuestionCategory = null;

function ensureScoresFile() {
    const dir = path.dirname(SCORES_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(SCORES_FILE)) {
        fs.writeFileSync(SCORES_FILE, JSON.stringify({}, null, 2));
    }
}

function loadQuestions() {
    try {
        const raw = fs.readFileSync(QUESTIONS_FILE, 'utf8').trim();
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('[DEMON QUIZ] Failed to load questions:', error);
        return [];
    }
}

function loadScores() {
    try {
        ensureScoresFile();
        const raw = fs.readFileSync(SCORES_FILE, 'utf8').trim();
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        console.error('[DEMON QUIZ] Failed to load scores:', error);
        return {};
    }
}

function saveScores(scores) {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

function ensureUserScore(scores, userId) {
    if (!scores[userId]) {
        scores[userId] = {
            points: 0,
            correct: 0,
            wrong: 0,
            played: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastAnsweredAt: 0
        };
    }

    const user = scores[userId];
    user.points = Number(user.points) || 0;
    user.correct = Number(user.correct) || 0;
    user.wrong = Number(user.wrong) || 0;
    user.played = Number(user.played) || 0;
    user.currentStreak = Number(user.currentStreak) || 0;
    user.bestStreak = Number(user.bestStreak) || 0;
    user.lastAnsweredAt = Number(user.lastAnsweredAt) || 0;

    return user;
}

function getTitleProgress(points) {
    const normalizedPoints = Number(points) || 0;
    let currentStage = TITLE_STAGES[0];

    for (const stage of TITLE_STAGES) {
        if (normalizedPoints >= stage.minPoints) {
            currentStage = stage;
        }
    }

    const currentIndex = TITLE_STAGES.findIndex(stage => stage.name === currentStage.name);
    const nextStage = TITLE_STAGES[currentIndex + 1] || null;
    const currentFloor = currentStage.minPoints;
    const nextCeiling = nextStage ? nextStage.minPoints : currentFloor;
    const span = Math.max(1, nextCeiling - currentFloor);
    const progress = nextStage ? Math.min(1, Math.max(0, (normalizedPoints - currentFloor) / span)) : 1;

    return {
        title: currentStage.name,
        currentPoints: normalizedPoints,
        nextTitle: nextStage ? nextStage.name : null,
        nextPoints: nextStage ? nextStage.minPoints : null,
        progress
    };
}

function buildProgressBar(progress, segments = 10) {
    const filled = Math.round(Math.max(0, Math.min(1, progress)) * segments);
    return `${'█'.repeat(filled)}${'░'.repeat(Math.max(0, segments - filled))}`;
}

function inferQuestionCategory(question) {
    const text = `${question.question || ''} ${question.explanation || ''}`.toLowerCase();

    if (text.includes('audio') || text.includes('suara') || text.includes('teriakan') || text.includes('wail') || text.includes('step')) {
        return 'audio';
    }

    if (text.includes('garam') || text.includes('blink') || text.includes('lari') || text.includes('cepat') || text.includes('roaming') || text.includes('hunt')) {
        return 'movement';
    }

    if (text.includes('api') || text.includes('lentera') || text.includes('foto') || text.includes('headless') || text.includes('bayangan') || text.includes('tembok') || text.includes('corpse') || text.includes('teleport')) {
        return 'visual';
    }

    if (text.includes('tips') || text.includes('disarankan') || text.includes('gunakan') || text.includes('cek') || text.includes('pantau') || text.includes('konfirmasi')) {
        return 'tips';
    }

    if (text.includes('bakar') || text.includes('crucifix') || text.includes('elektronik') || text.includes('target') || text.includes('energi')) {
        return 'behavior';
    }

    return 'general';
}

function trimRecentQuestionHistory() {
    while (recentQuestionIds.length > 12) {
        recentQuestionIds.shift();
    }
}

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomQuestion() {
    const questions = loadQuestions();
    if (questions.length === 0) return null;

    const grouped = new Map();

    for (const question of questions) {
        const category = inferQuestionCategory(question);
        if (!grouped.has(category)) {
            grouped.set(category, []);
        }
        grouped.get(category).push(question);
    }

    const categoryOrder = [...grouped.keys()];
    const availableCategories = categoryOrder.filter(category => category !== lastQuestionCategory && grouped.get(category).length > 0);
    const chosenCategory = availableCategories.length > 0 ? pickRandom(availableCategories) : pickRandom(categoryOrder);

    const pool = grouped.get(chosenCategory) || questions;
    const nonRecent = pool.filter(question => !recentQuestionIds.includes(question.id));
    const chosenQuestion = pickRandom(nonRecent.length > 0 ? nonRecent : pool);

    lastQuestionCategory = chosenCategory;
    recentQuestionIds.push(chosenQuestion.id);
    trimRecentQuestionHistory();

    return chosenQuestion;
}

function startQuiz(channel, askedByUserId) {
    const channelId = channel.id;
    if (activeQuizzes.has(channelId)) {
        return { ok: false, reason: 'already_active' };
    }

    const question = getRandomQuestion();
    if (!question) {
        return { ok: false, reason: 'empty_question_bank' };
    }

    const timeout = setTimeout(async () => {
        const current = activeQuizzes.get(channelId);
        if (!current) return;

        activeQuizzes.delete(channelId);
        try {
            await channel.send(`Waktu habis! Jawaban benar: **${current.question.answer}**. ${current.question.explanation}`);
        } catch (error) {
            console.error('[DEMON QUIZ] Failed to send timeout message:', error);
        }
    }, ACTIVE_DURATION_MS);

    activeQuizzes.set(channelId, {
        question,
        askedByUserId,
        startedAt: Date.now(),
        timeout
    });

    return {
        ok: true,
        question,
        expiresInMs: ACTIVE_DURATION_MS
    };
}

function normalizeAnswer(rawAnswer) {
    return String(rawAnswer || '').trim().toUpperCase().replace(/[^A-D]/g, '');
}

function answerQuiz(channelId, userId, rawAnswer) {
    const quiz = activeQuizzes.get(channelId);
    if (!quiz) {
        return { ok: false, reason: 'no_active_quiz' };
    }

    const answer = normalizeAnswer(rawAnswer);
    if (!['A', 'B', 'C', 'D'].includes(answer)) {
        return { ok: false, reason: 'invalid_answer' };
    }

    clearTimeout(quiz.timeout);
    activeQuizzes.delete(channelId);

    const scores = loadScores();
    const user = ensureUserScore(scores, userId);
    const correct = answer === quiz.question.answer;

    user.played += 1;
    user.lastAnsweredAt = Date.now();

    if (correct) {
        user.correct += 1;
        user.points += CORRECT_REWARD_POINTS;
        user.currentStreak += 1;
        if (user.currentStreak > user.bestStreak) {
            user.bestStreak = user.currentStreak;
        }
    } else {
        user.wrong += 1;
        user.currentStreak = 0;
    }

    saveScores(scores);

    return {
        ok: true,
        correct,
        answer,
        correctAnswer: quiz.question.answer,
        question: quiz.question,
        pointsReward: correct ? CORRECT_REWARD_POINTS : 0,
        moneyReward: correct ? CORRECT_MONEY_REWARD : 0,
        user,
        titleProgress: getTitleProgress(user.points)
    };
}

function getUserScore(userId) {
    const scores = loadScores();
    return ensureUserScore(scores, userId);
}

function getLeaderboard(limit = 10) {
    const scores = loadScores();

    return Object.entries(scores)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.correct !== a.correct) return b.correct - a.correct;
            return a.wrong - b.wrong;
        })
        .slice(0, limit)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}

module.exports = {
    startQuiz,
    answerQuiz,
    getUserScore,
    getLeaderboard,
    getTitleProgress,
    buildProgressBar,
    ACTIVE_DURATION_MS,
    CORRECT_REWARD_POINTS,
    CORRECT_MONEY_REWARD
};
