document.addEventListener('DOMContentLoaded', () => {
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const nextStageButton = document.getElementById('next-stage-button');
    const restartButton = document.getElementById('restart-button');
    const resultMessage = document.getElementById('result-message');
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');
    const raccoon = document.getElementById('raccoon');
    const catchSound = document.getElementById('catch-sound');

    let currentStage = 0;
    let score = 0;
    let timer = 0;
    let timerInterval;

    const starPoints = {
        'normal': 1,
        'rainbow': 2,
        'diamond': 5
    };

    const stageConfig = {
        1: {
            stars: 30,
            ratios: { normal: 0.9, rainbow: 0.1, diamond: 0 },
            clearScore: 20,
            timeLimit: 60
        },
        2: {
            stars: 30,
            ratios: { normal: 0.5, rainbow: 0.5, diamond: 0 },
            clearScore: 30,
            timeLimit: 60
        },
        3: {
            stars: 30,
            ratios: { normal: 0.2, rainbow: 0.7, diamond: 0.1 },
            clearScore: 50,
            timeLimit: 60
        }
    };

    startButton.addEventListener('click', () => {
        startStage(1);
    });

    nextStageButton.addEventListener('click', () => {
        startStage(currentStage + 1);
    });

    restartButton.addEventListener('click', () => {
        startStage(1);
    });

    function startStage(stageNumber) {
        currentStage = stageNumber;
        score = 0;
        timer = stageConfig[stageNumber].timeLimit;
        gameScreen.innerHTML = '';
        resultMessage.textContent = '';
        startButton.classList.add('hidden');
        nextStageButton.classList.add('hidden');
        restartButton.classList.add('hidden');
        scoreDisplay.textContent = `スコア: ${score}`;
        timerDisplay.textContent = `時間: ${timer}`;

        const config = stageConfig[stageNumber];
        const starPool = createStarPool(config.stars, config.ratios);

        let starCount = 0;
        const starInterval = setInterval(() => {
            if (starCount >= config.stars) {
                clearInterval(starInterval);
                return;
            }
            createStar(starPool[starCount]);
            starCount++;
        }, 1500);

        timerInterval = setInterval(() => {
            timer--;
            timerDisplay.textContent = `時間: ${timer}`;
            if (timer <= 0) {
                clearInterval(timerInterval);
                clearInterval(starInterval);
                checkResult();
            }
        }, 1000);
    }

    function createStarPool(totalStars, ratios) {
        const pool = [];
        const normalCount = Math.floor(totalStars * ratios.normal);
        const rainbowCount = Math.floor(totalStars * ratios.rainbow);
        const diamondCount = totalStars - normalCount - rainbowCount;

        for (let i = 0; i < normalCount; i++) pool.push('normal');
        for (let i = 0; i < rainbowCount; i++) pool.push('rainbow');
        for (let i = 0; i < diamondCount; i++) pool.push('diamond');

        return shuffleArray(pool);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createStar(starType) {
        const star = document.createElement('div');
        star.classList.add('star', starType);
        star.style.left = `${Math.random() * 90}vw`;
        gameScreen.appendChild(star);

        // タッチで星を消す処理
        star.addEventListener('click', () => {
            catchSound.play();
            score += starPoints[starType];
            scoreDisplay.textContent = `スコア: ${score}`;
            star.remove();
        });
    }

    function checkResult() {
        const requiredScore = stageConfig[currentStage].clearScore;

        if (score >= requiredScore) {
            if (currentStage < 3) {
                resultMessage.textContent = "ステージクリア！";
                nextStageButton.classList.remove('hidden');
            } else {
                resultMessage.textContent = "ゲームクリア！";
                restartButton.classList.remove('hidden');
            }
        } else {
            resultMessage.textContent = "ゲームオーバー";
            restartButton.classList.remove('hidden');
        }
    }

    // アライグマを指で動かすための処理
    let isDragging = false;
    let startX = 0;
    let raccoonX = 0;

    raccoon.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        raccoonX = raccoon.offsetLeft;
    });

    raccoon.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        raccoonX = raccoon.offsetLeft;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newX = raccoonX + e.clientX - startX;
        raccoon.style.left = `${Math.max(0, Math.min(window.innerWidth - raccoon.offsetWidth, newX))}px`;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const newX = raccoonX + e.touches[0].clientX - startX;
        raccoon.style.left = `${Math.max(0, Math.min(window.innerWidth - raccoon.offsetWidth, newX))}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
});
