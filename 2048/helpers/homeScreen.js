/**
 * Home screen variant #1: Minimal splash
 * Big glowing title, Play button fades in beneath it.
 */
function renderHomeMinimal() {
    const content = document.querySelector('#homeContent');
    content.innerHTML = `
        <h1 id="homeTitle">2048</h1>
        <button id="playButton" type="button">Play</button>
    `;

    const title = document.querySelector('#homeTitle');
    title.style.color = colourScheme.tiles[64];
    title.style.animation = 'pulseGlow 2.5s ease-in-out infinite';

    const playBtn = document.querySelector('#playButton');
    playBtn.style.backgroundColor = colourScheme.second;
    playBtn.style.color = colourScheme.base;
}

/**
 * Home screen variant #2: Self-playing demo board
 * A faint mini board behind the title randomly cycles tile values
 * on an interval, giving an "alive" ambient effect.
 */
function renderHomeDemo() {
    const content = document.querySelector('#homeContent');
    content.innerHTML = `
        <div id="demoBoard"></div>
        <h1 id="homeTitle">2048</h1>
        <button id="playButton" type="button">Play</button>
    `;

    const title = document.querySelector('#homeTitle');
    title.style.color = colourScheme.tiles[64];
    title.style.animation = 'pulseGlow 2.5s ease-in-out infinite';

    const playBtn = document.querySelector('#playButton');
    playBtn.style.backgroundColor = colourScheme.second;
    playBtn.style.color = colourScheme.base;

    const demoBoard = document.querySelector('#demoBoard');
    const cellSize = 60; // 55px tile + 5px gap
    const values = [2, 4, 8, 16, 32, 64, 128];
    const demoTiles = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = document.createElement('div');
            tile.classList.add('demoTile');
            tile.style.top = `${row * cellSize}px`;
            tile.style.left = `${col * cellSize}px`;
            tile.style.opacity = '0';
            demoBoard.appendChild(tile);
            demoTiles.push(tile);
        }
    }

    // Periodically "flicker" a handful of random tiles to new values
    setInterval(() => {
        const shuffled = [...demoTiles].sort(() => Math.random() - 0.5);
        const toUpdate = shuffled.slice(0, 3 + Math.floor(Math.random() * 3));

        toUpdate.forEach(tile => {
            const value = values[Math.floor(Math.random() * values.length)];
            tile.style.opacity = '0';
            setTimeout(() => {
                tile.textContent = value;
                tile.style.backgroundColor = colourScheme.getTile(value);
                tile.style.opacity = '1';
            }, 300);
        });
    }, 900);
}

/**
 * Home screen variant #3: Tile-built logo
 * "2048" is spelled out with real tile-styled elements that fly in
 * from off-screen edges and land in formation before Play appears.
 */
async function renderHomeTileLogo() {
    const content = document.querySelector('#homeContent');
    content.innerHTML = `
        <div id="logoContainer" style="position: relative; width: 340px; height: 90px;"></div>
        <button id="playButton" type="button" style="opacity: 0;">Play</button>
    `;

    const playBtn = document.querySelector('#playButton');
    playBtn.style.backgroundColor = colourScheme.second;
    playBtn.style.color = colourScheme.base;

    const logoContainer = document.querySelector('#logoContainer');
    const chars = [
        { text: '2', value: 2 },
        { text: '0', value: 4 },
        { text: '4', value: 8 },
        { text: '8', value: 16 }
    ];

    const tileGap = 80;

    const flights = chars.map((char, i) => {
        const targetLeft = i * tileGap;
        const targetTop = 0;

        const edge = Math.floor(Math.random() * 4);
        const boardSize = 340;
        let startTop, startLeft;
        switch (edge) {
            case 0: startTop = -150; startLeft = Math.random() * boardSize; break;
            case 1: startTop = 200; startLeft = Math.random() * boardSize; break;
            case 2: startTop = Math.random() * 90; startLeft = -150; break;
            default: startTop = Math.random() * 90; startLeft = boardSize + 80;
        }

        const tile = document.createElement('div');
        tile.classList.add('logoTile');
        tile.textContent = char.text;
        tile.style.backgroundColor = colourScheme.getTile(char.value);
        tile.style.top = `${startTop}px`;
        tile.style.left = `${startLeft}px`;
        tile.style.opacity = '0';

        logoContainer.appendChild(tile);

        return tile.animate(
            [
                { top: `${startTop}px`, left: `${startLeft}px`, transform: 'rotate(0deg) scale(0.5)', opacity: 0 },
                { top: `${targetTop}px`, left: `${targetLeft}px`, transform: 'rotate(360deg) scale(1)', opacity: 1 }
            ],
            { duration: 600, delay: i * 120, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        ).finished;
    });

    await Promise.all(flights);
    await pause(150);

    document.querySelector('#playButton').animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 400, easing: 'ease-out', fill: 'forwards' }
    );
}