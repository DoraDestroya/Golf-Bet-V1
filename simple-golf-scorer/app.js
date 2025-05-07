// Game state
let gameState = {
    type: '',
    players: [],
    currentHole: 1,
    scores: {}
};

// DOM Elements
const gameTypeSelect = document.getElementById('gameType');
const playerList = document.getElementById('playerList');
const addPlayerBtn = document.getElementById('addPlayer');
const startGameBtn = document.getElementById('startGame');
const activeGame = document.getElementById('activeGame');
const scoreTable = document.getElementById('scoreTable');
const prevHoleBtn = document.getElementById('prevHole');
const nextHoleBtn = document.getElementById('nextHole');
const currentHoleSpan = document.getElementById('currentHole');
const gameTitle = document.getElementById('gameTitle');

// Add player input field
addPlayerBtn.addEventListener('click', () => {
    const playerInput = document.createElement('div');
    playerInput.className = 'input-group mb-2';
    playerInput.innerHTML = `
        <input type="text" class="form-control player-input" placeholder="Player name">
        <button class="btn btn-outline-danger remove-player">×</button>
    `;
    playerList.appendChild(playerInput);
});

// Remove player input field
playerList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-player')) {
        e.target.parentElement.remove();
    }
});

// Start new game
startGameBtn.addEventListener('click', () => {
    const players = Array.from(document.querySelectorAll('.player-input'))
        .map(input => input.value.trim())
        .filter(name => name !== '');

    if (players.length < 2) {
        alert('Please add at least 2 players');
        return;
    }

    gameState = {
        type: gameTypeSelect.value,
        players: players,
        currentHole: 1,
        scores: {}
    };

    // Initialize scores for each player
    players.forEach(player => {
        gameState.scores[player] = Array(18).fill(null);
    });

    // Show active game
    document.querySelector('.game-card').style.display = 'none';
    activeGame.style.display = 'block';
    gameTitle.textContent = `${gameState.type.charAt(0).toUpperCase() + gameState.type.slice(1)} Game`;
    updateScoreTable();
});

// Update score table
function updateScoreTable() {
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Player</th>
        ${Array(18).fill().map((_, i) => `<th>${i + 1}</th>`).join('')}
        <th>Total</th>
    `;
    table.appendChild(headerRow);

    // Create rows for each player
    gameState.players.forEach(player => {
        const row = document.createElement('tr');
        const scores = gameState.scores[player];
        const total = scores.reduce((sum, score) => sum + (score || 0), 0);
        
        row.innerHTML = `
            <td>${player}</td>
            ${scores.map((score, i) => `
                <td>
                    <input type="number" 
                           class="form-control score-input" 
                           value="${score || ''}"
                           data-player="${player}"
                           data-hole="${i + 1}"
                           ${i + 1 === gameState.currentHole ? '' : 'disabled'}>
                </td>
            `).join('')}
            <td class="total-score">${total}</td>
        `;
        table.appendChild(row);
    });

    scoreTable.innerHTML = '';
    scoreTable.appendChild(table);
    currentHoleSpan.textContent = `Hole ${gameState.currentHole}`;

    // Add event listeners to score inputs
    document.querySelectorAll('.score-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const player = e.target.dataset.player;
            const hole = parseInt(e.target.dataset.hole);
            const score = parseInt(e.target.value) || null;
            gameState.scores[player][hole - 1] = score;
            updateScoreTable();
        });
    });
}

// Navigation between holes
prevHoleBtn.addEventListener('click', () => {
    if (gameState.currentHole > 1) {
        gameState.currentHole--;
        updateScoreTable();
    }
});

nextHoleBtn.addEventListener('click', () => {
    if (gameState.currentHole < 18) {
        gameState.currentHole++;
        updateScoreTable();
    }
}); 