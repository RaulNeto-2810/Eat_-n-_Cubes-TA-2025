// Atividade prática #02
// Colisões básicas (ambiente e jogadores)
// a. Implementar barreiras (paredes) para que os jogadores não saiam da tela.
// b. Prevenir sobreposição de jogadores.

// Identificação e Personalização
// a. Atribuir nomes ou apelidos aos jogadores.
// b. Permitir escolha de cor/skin ao conectar.

// Sincronização mais eficiente
// a. Implementar "delta updates" (só enviar o que mudou).

// Desconexão de jogadores
// a. Mostrar mensagem de "Jogador saiu do jogo".

// Sistema de Pontuação
// a. Itens aparecem aleatoriamente no ambiente.
// b. Adicionar pontos quando o jogador atingir metas (ex: coletar itens).
// c. Criar um placar global no servidor.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const GAME_WIDTH = 800; 
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 30;
const PLAYER_SPEED = 5;
const ITEM_SIZE = 15;
const MAX_ITEMS = 3;

let players = {};
let items = {};
let itemCounter = 0;

function spawnItem() {
    if (Object.keys(items).length >= MAX_ITEMS) return;

    const itemId = `item-${itemCounter++}`;
    const position = {
        x: Math.floor(Math.random() * (GAME_WIDTH - ITEM_SIZE)),
        y: Math.floor(Math.random() * (GAME_HEIGHT - ITEM_SIZE))
    };
    items[itemId] = { id: itemId, ...position };
    io.emit('itemSpawned', items[itemId]);
}

for (let i = 0; i < MAX_ITEMS; i++) {
    spawnItem();
}

io.on('connection', (socket) => {
    socket.on('joinGame', (data) => {
        console.log(`Jogador ${data.name} (${socket.id}) entrou no jogo.`);
        players[socket.id] = {
            id: socket.id,
            x: Math.floor(Math.random() * (GAME_WIDTH - PLAYER_SIZE)),
            y: Math.floor(Math.random() * (GAME_HEIGHT - PLAYER_SIZE)),
            color: data.color || '#000000',
            name: data.name,
            score: 0,
            keys: { left: false, right: false, up: false, down: false } 
        };

        socket.emit('gameSetup', { players, items });
        io.emit('updateChat', `${data.name} entrou no jogo.`);
        socket.broadcast.emit('newPlayer', players[socket.id]);
    });

    socket.on('playerInput', (keys) => {
        if (players[socket.id]) {
            players[socket.id].keys = keys;
        }
    });

    socket.on('disconnect', () => {
        const player = players[socket.id];
        if (player) {
            console.log(`Jogador ${player.name} (${socket.id}) desconectou.`);
            io.emit('updateChat', `${player.name} saiu do jogo.`);
            delete players[socket.id];
            io.emit('playerDisconnected', socket.id);
        }
    });
});

setInterval(() => {
    const movedPlayers = {};

    for (const id in players) {
        const player = players[id];
        let hasMoved = false;
        let nextX = player.x;
        let nextY = player.y;

        if (player.keys.left) nextX -= PLAYER_SPEED;
        if (player.keys.right) nextX += PLAYER_SPEED;
        if (player.keys.up) nextY -= PLAYER_SPEED;
        if (player.keys.down) nextY += PLAYER_SPEED;

        if (nextX < 0) nextX = 0;
        if (nextX > GAME_WIDTH - PLAYER_SIZE) nextX = GAME_WIDTH - PLAYER_SIZE;
        if (nextY < 0) nextY = 0;
        if (nextY > GAME_HEIGHT - PLAYER_SIZE) nextY = GAME_HEIGHT - PLAYER_SIZE;

        for (const otherId in players) {
            if (id === otherId) continue;
            const otherPlayer = players[otherId];
            if (
                nextX < otherPlayer.x + PLAYER_SIZE &&
                nextX + PLAYER_SIZE > otherPlayer.x &&
                nextY < otherPlayer.y + PLAYER_SIZE &&
                nextY + PLAYER_SIZE > otherPlayer.y
            ) {
                nextX = player.x;
                nextY = player.y;
                break;
            }
        }

        if (player.x !== nextX || player.y !== nextY) {
            player.x = nextX;
            player.y = nextY;
            hasMoved = true;
        }

        for (const itemId in items) {
            const item = items[itemId];
            if (
                player.x < item.x + ITEM_SIZE &&
                player.x + PLAYER_SIZE > item.x &&
                player.y < item.y + ITEM_SIZE &&
                player.y + PLAYER_SIZE > item.y
            ) {
                player.score += 10;
                delete items[itemId];
                io.emit('itemRemoved', itemId);
                io.emit('scoreUpdate', players);
                spawnItem();
            }
        }

        if (hasMoved) {
            movedPlayers[id] = { x: player.x, y: player.y };
        }
    }

    if (Object.keys(movedPlayers).length > 0) {
        io.emit('gameStateUpdate', movedPlayers);
    }

}, 1000 / 60);

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});