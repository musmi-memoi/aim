const gameTarget = document.getElementById("game-target");
const scoreDisplay = document.getElementById("score");
const timeBar = document.getElementById("time-bar");
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-button");
let score = 0;
let gameTime;
let gameTimer;

function moveTarget() {
	const x = Math.random() * (window.innerWidth - gameTarget.offsetWidth);
	const y = Math.random() * (window.innerHeight - gameTarget.offsetHeight);
	gameTarget.style.transform = `translate(${x}px, ${y}px)`;
}

function setupGame() {
	// ターゲットにイベントリスナーを設定
	gameTarget.addEventListener("click", function (event) {
		event.stopPropagation(); // イベントのバブリングを停止
		calculateScore(event);
		moveTarget();
	});

	// ゲーム画面全体のクリックイベントを検出してスコアを減点
	gameScreen.addEventListener("click", function () {
		score = Math.max(0, score - 50); // スコアを-50点するが、最低0点を保証
		scoreDisplay.textContent = `スコア: ${Math.round(score)}`;
		moveTarget();
	});
}

function calculateScore(event) {
	const rect = gameTarget.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	const dx = event.clientX - centerX;
	const dy = event.clientY - centerY;
	const distance = Math.sqrt(dx * dx + dy * dy);
	const newScore = Math.max(0, 50 - distance);
	score += newScore;
	scoreDisplay.textContent = `スコア: ${Math.round(score)}`;
	moveTarget();
}

function startGame() {
	score = 0;
	gameTime = 30;
	scoreDisplay.textContent = `スコア: ${score}`;
	timeBar.style.width = "100%";
	titleScreen.style.display = "none";
	gameScreen.style.display = "block";
	gameTarget.addEventListener("click", calculateScore);
	setupGame();
	moveTarget();
	gameTimer = setInterval(updateTimer, 100);
}

function endGame() {
	clearInterval(gameTimer);
	gameTarget.removeEventListener("click", calculateScore);
	gameScreen.style.display = "none"; // ゲーム画面を隠す
	titleScreen.style.display = "flex"; // タイトル画面をフレックスボックスとして中央に表示
	titleScreen.style.justifyContent = "center";
	titleScreen.style.alignItems = "center";
	alert(
		`時間切れ！ あなたのスコアは ${Math.round(score)} です。${getRank(score)}`
	);
}

function getRank(score) {
	if (score >= 1600) return "ランクS";
	if (score >= 700) return "ランクA";
	if (score >= 450) return "ランクB";
	if (score >= 300) return "ランクC";
	return "ランクD";
}

function updateTimer() {
	gameTime -= 0.1;
	timeBar.style.width = `${(gameTime / 30) * 100}%`;
	if (gameTime <= 0) {
		endGame();
	}
}

startButton.addEventListener("click", startGame);

// ゲーム開始前はゲーム画面と再プレイボタンを隠す
gameScreen.style.display = "none";
