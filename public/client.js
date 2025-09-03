const socket = io();
const loginScreen = document.getElementById('login-screen');
const gameContainer = document.getElementById('game-container');
const joinButton = document.getElementById('joinButton');
const playerNameInput = document.getElementById('playerNameInput');
const playerColorInput = document.getElementById('playerColorInput');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboardDiv = document.getElementById('scoreboard');
const messagesDiv = document.getElementById('messages');
const playerPreview = document.getElementById('player-preview');
const exitButton = document.getElementById('exitButton');
const keys = { left: false, right: false, up: false, down: false };
let players = {};
let items = {};
let myId = null;

joinButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const color = playerColorInput.value;
    if (name) {
        socket.emit('joinGame', { name, color });
        loginScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    }
});

exitButton.addEventListener('click', () => {
    window.location.reload();
});

function updatePreviewColor() {
    playerPreview.style.backgroundColor = playerColorInput.value;
}

playerColorInput.addEventListener('input', updatePreviewColor);

socket.on('gameSetup', (data) => {
    players = data.players;
    items = data.items;
    myId = socket.id;
    updateScoreboard();
    gameLoop();
});

socket.on('newPlayer', (player) => {
    players[player.id] = player;
});

socket.on('playerDisconnected', (playerId) => {
    delete players[playerId];
    updateScoreboard();
});

socket.on('gameStateUpdate', (movedPlayers) => {
    for (const id in movedPlayers) {
        if (players[id]) {
            players[id].x = movedPlayers[id].x;
            players[id].y = movedPlayers[id].y;
        }
    }
});

socket.on('itemSpawned', (item) => {
    items[item.id] = item;
});

socket.on('itemRemoved', (itemId) => {
    delete items[itemId];
});

socket.on('scoreUpdate', (updatedPlayers) => {
    players = updatedPlayers;
    updateScoreboard();
});

socket.on('updateChat', (message) => {
    const p = document.createElement('p');
    p.textContent = message;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') keys.left = true;
    if (event.key === 'ArrowRight') keys.right = true;
    if (event.key === 'ArrowUp') keys.up = true;
    if (event.key === 'ArrowDown') keys.down = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') keys.left = false;
    if (event.key === 'ArrowRight') keys.right = false;
    if (event.key === 'ArrowUp') keys.up = false;
    if (event.key === 'ArrowDown') keys.down = false;
});

setInterval(() => {
    if (myId) {
        socket.emit('playerInput', keys);
    }
}, 1000 / 60);

function updateScoreboard() {
    const scoreboardList = document.getElementById('scoreboard-list');
    const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

    scoreboardList.innerHTML = ''; 
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score}`;
        scoreboardList.appendChild(li);
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const id in items) {
        const item = items[id];
        ctx.fillStyle = 'gold';
        ctx.beginPath();
        ctx.arc(item.x + 7.5, item.y + 7.5, 7.5, 0, 2 * Math.PI);
        ctx.fill();
    }

    for (const id in players) {
        const player = players[id];
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 30, 30);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, player.x + 15, player.y - 5);
    }
}

function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}