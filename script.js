document.addEventListener('DOMContentLoaded', () => {
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const nextStageButton = document.getElementById('next-stage-button');
    const restartButton = document.getElementById('restart-button');
    const resultMessage = document.getElementById('result-message');
    const bgm = document.getElementById('bgm');
    let currentStage = 0;
    let score = 0;

    const starSounds = {
        normal: new Audio('star_pop.mp3'),
        rainbow: new Audio('star_pop_rainbow.mp3'),
        diamond: new Audio('star_diamond_catch.mp3')
    };

    const starPoints = {
        'normal': 1,
        'rainbow': 2,
        'diamond': 5
    };

    const stageConfig = {
        1: {
            stars: 30,
            ratios: { normal: 0.9, rainbow: 0.1, diamond: 0 },
            clearScore: 30
        },
        2: {
            stars: 30,
            ratios: { normal: 0.5, rainbow: 0.5, diamond: 0 },
            clearScore: 40
        },
        3: {
            stars: 30,
            ratios: { normal: 0.2, rainbow: 0.7, diamond: 0.1 },
            clearScore: 60
        }
    };

    startButton.addEventListener('click', () => {
        bgm.play();
        startStage(1);
    });

    nextStageButton.addEventListener('click', () => {
        startStage(currentStage + 1);
    });

    restartButton.addEventListener('click', () => {
        bgm.pause();
        bgm.currentTime = 0;
        startStage(1);
    });

    function startStage(stageNumber) {
        currentStage = stageNumber;
        score = 0;
        gameScreen.innerHTML = '';
        resultMessage.textContent = '';
        startButton.classList.add('hidden');
        nextStageButton.classList.add('hidden');
        restartButton.classList.add('hidden');

        const config = stageConfig[stageNumber];
        const starPool = createStarPool(config.stars, config.ratios);

        let starCount = 0;
        const starInterval = setInterval(() => {
            if (starCount >= config.stars) {
                clearInterval(starInterval);
                checkResult();
                return;
            }
            createStar(starPool[starCount]);
            starCount++;
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

        star.addEventListener('click', () => {
            const sound = starSounds[starType];
            if (sound) {
                sound.play();
            }
            score += starPoints[starType];
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
});
