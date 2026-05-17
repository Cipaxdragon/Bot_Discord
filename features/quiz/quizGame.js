const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');
const SCORES_FILE = path.join(__dirname, 'data', 'quizScores.json');
const QUIZ_DURATION_MS = 30_000;
const CORRECT_REWARD = 25;
const WRONG_PENALTY = 0;
const CORRECT_MONEY_REWARD = 75;

const activeQuizzes = new Map();

function loadQuestions() {
    try {
        const raw = fs.readFileSync(QUESTIONS_FILE, 'utf8').trim();
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('[QUIZ] Gagal membaca bank soal:', error);
        return [];
    }
}

function ensureScoresFile() {
    const dir = path.dirname(SCORES_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(SCORES_FILE)) {
        fs.writeFileSync(SCORES_FILE, JSON.stringify({}, null, 2));
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
        console.error('[QUIZ] Gagal membaca data skor:', error);
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
            lastAnsweredAt: 0
        };
    }

    return scores[userId];
}

function getRandomQuestion() {
    const questions = loadQuestions();
    if (questions.length === 0) return null;

    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
}

function hasActiveQuiz(channelId) {
    return activeQuizzes.has(channelId);
}

function startQuiz(channel, askedByUserId) {
    const channelId = channel.id;
    if (hasActiveQuiz(channelId)) {
        return {
            ok: false,
            reason: 'already_active'
        };
    }

    const question = getRandomQuestion();
    if (!question) {
        return {
            ok: false,
            reason: 'empty_question_bank'
        };
    }

    const timeout = setTimeout(async () => {
        const current = activeQuizzes.get(channelId);
        if (!current) return;

        activeQuizzes.delete(channelId);
        try {
            await channel.send(
                `Waktu habis! Jawaban benar: **${current.question.answer}**. ${current.question.explanation}`
            );
        } catch (error) {
            console.error('[QUIZ] Gagal kirim timeout message:', error);
        }
    }, QUIZ_DURATION_MS);

    activeQuizzes.set(channelId, {
        question,
        askedByUserId,
        startedAt: Date.now(),
        timeout
    });

    return {
        ok: true,
        question,
        expiresInMs: QUIZ_DURATION_MS
    };
}

function answerQuiz(channelId, userId, rawAnswer) {
    const quiz = activeQuizzes.get(channelId);
    if (!quiz) {
        return {
            ok: false,
            reason: 'no_active_quiz'
        };
    }

    const answer = String(rawAnswer || '').trim().toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(answer)) {
        return {
            ok: false,
            reason: 'invalid_answer'
        };
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
        user.points += CORRECT_REWARD;
    } else {
        user.wrong += 1;
        user.points = Math.max(0, user.points - WRONG_PENALTY);
    }

    saveScores(scores);

    return {
        ok: true,
        correct,
        answer,
        correctAnswer: quiz.question.answer,
        question: quiz.question,
        reward: correct ? CORRECT_REWARD : 0,
        moneyReward: correct ? CORRECT_MONEY_REWARD : 0,
        penalty: correct ? 0 : WRONG_PENALTY,
        user
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
    hasActiveQuiz,
    getUserScore,
    getLeaderboard,
    CORRECT_MONEY_REWARD
};
