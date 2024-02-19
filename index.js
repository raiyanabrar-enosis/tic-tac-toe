let board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];
let turn = 1;
let gameOver = 0;
let steps = [];
let timer = 10;
let move = 1;

function resetBoard() {
	board = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	];
	turn = 1;
	gameOver = 0;
	steps = [];
	timer = 10;
	move = 1;
}

function renderBoard(board) {
	let griditems = document.getElementsByClassName("griditem");

	for (let i = 0; i < griditems.length; i++) {
		let element = griditems[i];
		let boardIndex = getBoardIndexFromElement(element);
		let boardElement = board[boardIndex[0]][boardIndex[1]];

		element.textContent =
			boardElement == 0 ? "" : boardElement == 1 ? "X" : "O";
	}
}

function renderSteps(steps) {
	document.querySelector("#steps").innerHTML = "";
	for (let i = 0; i < steps.length; i++) {
		const element = steps[i];
		insertStep(element);
	}
}

function insertStep(step) {
	let stepelement = document.querySelector("#steps");

	let item = document.createElement("li");
	item.textContent = `Turn ${step.turn} - Player ${step.player} - Move ${step.position}`;
	item.className = "stepitem";
	item.id = "step-" + (step.turn - 1);
	stepelement.prepend(item);
}

function getBoardIndexFromElement(element) {
	const gridIndex = +element.id.split("-")[1] - 1;
	return [Math.floor(gridIndex / 3), gridIndex % 3];
}

function checkWinner(board, player) {
	// Row and column check
	for (let i = 0; i < board.length; i++) {
		if (JSON.stringify(board[i]) == JSON.stringify([player, player, player]))
			return true;
		else if (
			JSON.stringify([board[0][i], board[1][i], board[2][i]]) ==
			JSON.stringify([player, player, player])
		)
			return true;
	}

	// Diagonal check
	if (
		JSON.stringify([board[0][0], board[1][1], board[2][2]]) ==
		JSON.stringify([player, player, player])
	)
		return true;
	else if (
		JSON.stringify([board[0][2], board[1][1], board[2][0]]) ==
		JSON.stringify([player, player, player])
	)
		return true;

	return false;
}

function createAndShowModal(player, draw = false) {
	const modal = document.querySelector("#gameover");
	modal.innerHTML = `<p>Player ${player} wins</p>`;
	if (draw) modal.innerHTML = `<p>Match draw</p>`;

	modal.innerHTML += `
    <div class="button-group">
        <button class="btn btn-primary" id="btn-restart">Restart</button>
        <button class="btn btn-outline" id="btn-close">Close</button>
    </div>
    `;

	modal.addEventListener("click", (e) => {
		if (e.target.id == "btn-close") {
			modal.close();
		}
		if (e.target.id == "btn-restart") {
			resetBoard();
			renderBoard(board);
			renderSteps(steps);
			modal.close();
		}
	});

	modal.showModal();
}

function addWinToPlayer(player) {
	const playerwins = document.querySelector(`#player${player}wins`);
	let wins = +playerwins.textContent;
	wins++;
	playerwins.textContent = wins;
}

document.querySelector("#steps").addEventListener("click", (e) => {
	if (e.target.className == "stepitem") {
		const element = e.target;
		const turnNo = +element.id.split("-")[1];

		board = JSON.parse(JSON.stringify(steps[turnNo].boardstate));
		renderBoard(board);

		steps = steps.slice(0, turnNo + 1);
		renderSteps(steps);

		if (move != steps[turnNo].turn + 1) gameOver = 0;
		turn = turnNo == 1 ? 2 : 1;
		move = steps[turnNo].turn + 1;
		timer = 10;
	}
});

document.querySelector("#grid").addEventListener("click", (e) => {
	if (e.target.className == "griditem" && !gameOver) {
		let boardIndex = getBoardIndexFromElement(e.target);

		// Prevent replacing existing cells
		if (board[boardIndex[0]][boardIndex[1]] != 0) return;

		board[boardIndex[0]][boardIndex[1]] = +turn;
		renderBoard(board);

		if (checkWinner(board, turn)) {
			gameOver = 1;
			createAndShowModal(turn);
			addWinToPlayer(turn);
		} else if (move == 9) {
			gameOver = 1;
			createAndShowModal(turn, true);
		}

		const newStep = {
			turn: move,
			player: turn,
			position: boardIndex,
			boardstate: JSON.parse(JSON.stringify(board)),
		};
		steps.push(newStep);
		insertStep(newStep);

		turn = turn == 1 ? 2 : 1;
		move++;
		timer = 10;
	}
});

resetBoard();
renderBoard(board);
renderSteps(steps);
setInterval(() => {
	if (gameOver) return;

	if (timer > 0) timer--;
	document.querySelector("#timer").textContent = timer;

	if (timer == 0) {
		turn = turn == 1 ? 2 : 1;
		gameOver = 1;
		createAndShowModal(turn);
		addWinToPlayer(turn);
	}
}, 1000);
