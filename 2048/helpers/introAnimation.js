/**
 * Intro animation #1: Cascade Fill
 * Cells drop in with a diagonal stagger, then ghost tiles snake-fill
 * every cell with random values, flash, and clear — leaving the real
 * starting tiles to appear via the normal start() flow.
 */
async function playIntroCascade() {
    layoutSizes();

    // ===== Step 1: cells fade/scale in with diagonal stagger =====
    const cellEls = [];

    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < ROW; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = colourScheme.cells;
            cell.style.opacity = '0';

            const top  = row * (sizes.tile + sizes.gap) + sizes.gap;
            const left = col * (sizes.tile + sizes.gap) + sizes.gap;
            cell.style.top  = `${top}px`;
            cell.style.left = `${left}px`;

            board.appendChild(cell);
            cellEls.push({ el: cell, row, col });
        }
    }

    const cellStagger = cellEls.map(({ el, row, col }) => {
        const delay = (row + col) * 40; // diagonal wave, top-left outward
        return el.animate(
            [
                { opacity: 0, transform: 'scale(0.5)' },
                { opacity: 1, transform: 'scale(1)' }
            ],
            { duration: 250, delay, easing: 'ease-out', fill: 'forwards' }
        ).finished;
    });

    await Promise.all(cellStagger);

    // ===== Step 2: snake-fill path with ghost tiles =====
    const path = [];
    for (let row = 0; row < ROW; row++) {
        const cols = [...Array(ROW).keys()];
        if (row % 2 === 1) cols.reverse(); // boustrophedon (back-and-forth)
        for (let col of cols) path.push([row, col]);
    }

    const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    const ghostTiles = [];

    for (let [row, col] of path) {
        const value = values[Math.floor(Math.random() * values.length)];

        const ghost = document.createElement('div');
        ghost.classList.add('piece');
        ghost.textContent = value;
        ghost.style.backgroundColor = colourScheme.getTile(value);
        ghost.style.color = colourScheme.tileText;
        ghost.style.opacity = '0';
        ghost.style.width = `${sizes.tile}px`;
        ghost.style.height = `${sizes.tile}px`;

        const top  = row * (sizes.tile + sizes.gap) + sizes.gap;
        const left = col * (sizes.tile + sizes.gap) + sizes.gap;
        ghost.style.top  = `${top}px`;
        ghost.style.left = `${left}px`;

        board.appendChild(ghost);
        ghostTiles.push(ghost);

        await ghost.animate(
            [
                { opacity: 0, transform: 'scale(0.3)' },
                { opacity: 1, transform: 'scale(1.15)' },
                { opacity: 1, transform: 'scale(1)' }
            ],
            { duration: 120, easing: 'ease-out', fill: 'forwards' }
        ).finished;
    }

    await pause(200);

    // ===== Step 3: flash + clear everything =====
    const flash = board.animate(
        [
            { filter: 'brightness(1)' },
            { filter: 'brightness(2)' },
            { filter: 'brightness(1)' }
        ],
        { duration: 300, easing: 'ease-in-out' }
    ).finished;

    const clears = [...cellEls.map(c => c.el), ...ghostTiles].map(el =>
        el.animate(
            [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.6)' }
            ],
            { duration: 250, easing: 'ease-in', fill: 'forwards' }
        ).finished
    );

    await Promise.all([flash, ...clears]);

    for (let { el } of cellEls) el.remove();
    for (let ghost of ghostTiles) ghost.remove();
}

/**
 * Intro animation #2: Merge Storm
 * Ghost tiles fly in from off-screen edges with a tumble, then
 * randomly pair up and merge in cascading rounds (2->4->8...),
 * ending with a flash + clear before the real game starts.
 */
async function playIntroMergeStorm() {
    layoutSizes();
    const boardSize = board.clientWidth;

    function cellPos(row, col) {
        return {
            top: row * (sizes.tile + sizes.gap) + sizes.gap,
            left: col * (sizes.tile + sizes.gap) + sizes.gap
        };
    }

    // ===== Step 1: quick uniform fade-in for background cells =====
    const cellEls = [];
    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < ROW; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = colourScheme.cells;
            cell.style.opacity = '0';

            const { top, left } = cellPos(row, col);
            cell.style.top = `${top}px`;
            cell.style.left = `${left}px`;

            board.appendChild(cell);
            cellEls.push(cell);
        }
    }

    await Promise.all(cellEls.map(el =>
        el.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 200, easing: 'ease-out', fill: 'forwards' }
        ).finished
    ));

    // ===== Step 2: pick random target cells, spawn tiles off-screen, fly in =====
    const allCells = [];
    for (let row = 0; row < ROW; row++)
        for (let col = 0; col < ROW; col++)
            allCells.push([row, col]);

    // Shuffle and take 8 random cells to fill initially
    const shuffled = allCells.sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 8);

    function randomOffscreenStart() {
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: return { top: -120, left: Math.random() * boardSize };            // top
            case 1: return { top: boardSize + 40, left: Math.random() * boardSize };  // bottom
            case 2: return { top: Math.random() * boardSize, left: -120 };            // left
            default: return { top: Math.random() * boardSize, left: boardSize + 40 }; // right
        }
    }

    let tiles = []; // { el, value, row, col }

    const flights = targets.map(([row, col], i) => {
        const value = Math.random() < 0.5 ? 2 : 4;
        const start = randomOffscreenStart();
        const { top, left } = cellPos(row, col);

        const ghost = document.createElement('div');
        ghost.classList.add('piece');
        ghost.textContent = value;
        ghost.style.backgroundColor = colourScheme.getTile(value);
        ghost.style.color = colourScheme.tileText;
        ghost.style.width = `${sizes.tile}px`;
        ghost.style.height = `${sizes.tile}px`;
        ghost.style.top = `${start.top}px`;
        ghost.style.left = `${start.left}px`;
        ghost.style.opacity = '0';

        board.appendChild(ghost);
        tiles.push({ el: ghost, value, row, col });

        return ghost.animate(
            [
                { top: `${start.top}px`, left: `${start.left}px`, transform: 'rotate(0deg) scale(0.6)', opacity: 0 },
                { top: `${top}px`, left: `${left}px`, transform: 'rotate(360deg) scale(1)', opacity: 1 }
            ],
            { duration: 550, delay: i * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        ).finished;
    });

    await Promise.all(flights);
    await pause(150);

    // ===== Step 3: cascading merge rounds =====
    const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

    while (tiles.length > 2) {
        // shuffle and pair up
        tiles = tiles.sort(() => Math.random() - 0.5);
        const pairCount = Math.floor(tiles.length / 2);
        const survivors = [];
        const mergeAnims = [];

        for (let i = 0; i < pairCount; i++) {
            const acceptor = tiles[i * 2];
            const donor = tiles[i * 2 + 1];
            const { top: accTop, left: accLeft } = cellPos(acceptor.row, acceptor.col);

            mergeAnims.push(
                donor.el.animate(
                    [
                        { transform: 'scale(1)', opacity: 1 },
                        { top: `${accTop}px`, left: `${accLeft}px`, transform: 'scale(0.3)', opacity: 0 }
                    ],
                    { duration: 280, easing: 'ease-in', fill: 'forwards' }
                ).finished.then(() => donor.el.remove())
            );

            const newValueIdx = Math.min(values.indexOf(acceptor.value) + 1, values.length - 1);
            const newValue = values[newValueIdx];

            mergeAnims.push(
                acceptor.el.animate(
                    [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.3)' },
                        { transform: 'scale(1)' }
                    ],
                    { duration: 300, delay: 150, easing: 'ease-out' }
                ).finished.then(() => {
                    acceptor.value = newValue;
                    acceptor.el.textContent = newValue;
                    acceptor.el.style.backgroundColor = colourScheme.getTile(newValue);
                })
            );

            survivors.push(acceptor);
        }

        // any odd one out just carries over untouched
        if (tiles.length % 2 === 1) survivors.push(tiles[tiles.length - 1]);

        await Promise.all(mergeAnims);
        await pause(150);
        tiles = survivors;
    }

    // ===== Step 4: flash + clear everything =====
    const flash = board.animate(
        [
            { filter: 'brightness(1)' },
            { filter: 'brightness(2)' },
            { filter: 'brightness(1)' }
        ],
        { duration: 300, easing: 'ease-in-out' }
    ).finished;

    const clears = [...cellEls, ...tiles.map(t => t.el)].map(el =>
        el.animate(
            [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.6)' }
            ],
            { duration: 250, easing: 'ease-in', fill: 'forwards' }
        ).finished
    );

    await Promise.all([flash, ...clears]);

    cellEls.forEach(el => el.remove());
    tiles.forEach(t => t.el.remove());
}

/**
 * Intro animation #3: Spiral Assemble
 * Ghost tiles orbit inward along a decaying spiral path to their
 * target cell (center-out fill order), ticking through a few random
 * values mid-flight before settling — then flash + clear.
 */
async function playIntroSpiral() {
    layoutSizes();

    function cellPos(row, col) {
        return {
            top: row * (sizes.tile + sizes.gap) + sizes.gap,
            left: col * (sizes.tile + sizes.gap) + sizes.gap
        };
    }

    // ===== Step 1: cells fade in together =====
    const cellEls = [];
    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < ROW; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = colourScheme.cells;
            cell.style.opacity = '0';

            const { top, left } = cellPos(row, col);
            cell.style.top = `${top}px`;
            cell.style.left = `${left}px`;

            board.appendChild(cell);
            cellEls.push(cell);
        }
    }

    await Promise.all(cellEls.map(el =>
        el.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 200, easing: 'ease-out', fill: 'forwards' }
        ).finished
    ));

    // ===== Step 2: spiral tiles inward, center-out fill order =====
    const centerOrder = [
        [1,1],[1,2],[2,2],[2,1],
        [0,1],[0,2],[1,3],[2,3],[3,2],[3,1],[2,0],[1,0],
        [0,0],[0,3],[3,3],[3,0]
    ];

    const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    const ghostTiles = [];

    const spiralPromises = centerOrder.map(([row, col], i) => {
        const target = cellPos(row, col);
        const finalValue = values[Math.floor(Math.random() * 6)]; // keep low-ish for readability while ticking

        const ghost = document.createElement('div');
        ghost.classList.add('piece');
        ghost.textContent = finalValue;
        ghost.style.backgroundColor = colourScheme.getTile(finalValue);
        ghost.style.color = colourScheme.tileText;
        ghost.style.width = `${sizes.tile}px`;
        ghost.style.height = `${sizes.tile}px`;
        ghost.style.opacity = '0';

        board.appendChild(ghost);
        ghostTiles.push(ghost);

        return spiralInto(ghost, target, finalValue, values, i * 70);
    });

    await Promise.all(spiralPromises);
    await pause(200);

    // ===== Step 3: flash + clear everything =====
    const flash = board.animate(
        [
            { filter: 'brightness(1)' },
            { filter: 'brightness(2)' },
            { filter: 'brightness(1)' }
        ],
        { duration: 300, easing: 'ease-in-out' }
    ).finished;

    const clears = [...cellEls, ...ghostTiles].map(el =>
        el.animate(
            [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.6)' }
            ],
            { duration: 250, easing: 'ease-in', fill: 'forwards' }
        ).finished
    );

    await Promise.all([flash, ...clears]);

    cellEls.forEach(el => el.remove());
    ghostTiles.forEach(el => el.remove());
}

/**
 * Animates a single ghost tile along a decaying spiral path into `target`,
 * ticking its displayed value a few times mid-flight before settling on finalValue.
 */
async function spiralInto(el, target, finalValue, values, startDelay) {
    await pause(startDelay);

    const steps = 16;
    const loops = 1.5;
    const maxRadius = 140;
    const startAngle = Math.random() * Math.PI * 2;

    const keyframes = [];
    for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const angle = startAngle + loops * 2 * Math.PI * t;
        const radius = maxRadius * Math.pow(1 - t, 1.6); // decays faster near the end
        const x = target.left + radius * Math.cos(angle);
        const y = target.top + radius * Math.sin(angle);

        keyframes.push({
            top: `${y}px`,
            left: `${x}px`,
            opacity: t < 0.15 ? t / 0.15 : 1,
            transform: `scale(${0.5 + 0.5 * t}) rotate(${angle}rad)`,
            offset: t
        });
    }

    const anim = el.animate(keyframes, {
        duration: 700,
        easing: 'ease-out',
        fill: 'forwards'
    });

    // Tick the displayed value a few times mid-flight, slot-reel style
    let tickIndex = 0;
    const tickTimer = setInterval(() => {
        if (tickIndex < 3) {
            const tickValue = values[Math.floor(Math.random() * 4)];
            el.textContent = tickValue;
            el.style.backgroundColor = colourScheme.getTile(tickValue);
            tickIndex++;
        }
    }, 140);

    await anim.finished;
    clearInterval(tickTimer);

    el.textContent = finalValue;
    el.style.backgroundColor = colourScheme.getTile(finalValue);

    // Small landing pulse
    await el.animate(
        [{ transform: 'scale(1.15)' }, { transform: 'scale(1)' }],
        { duration: 150, easing: 'ease-out', fill: 'forwards' }
    ).finished;
}

/**
 * Intro animation #4: Number Rain
 * Tiles fall from above column by column, staggered, with a bounce
 * on landing — then flash + clear before the real game starts.
 */
async function playIntroRain() {
    layoutSizes();
    const boardSize = board.clientWidth;

    function cellPos(row, col) {
        return {
            top: row * (sizes.tile + sizes.gap) + sizes.gap,
            left: col * (sizes.tile + sizes.gap) + sizes.gap
        };
    }

    // ===== Step 1: cells fade in together =====
    const cellEls = [];
    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < ROW; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = colourScheme.cells;
            cell.style.opacity = '0';

            const { top, left } = cellPos(row, col);
            cell.style.top = `${top}px`;
            cell.style.left = `${left}px`;

            board.appendChild(cell);
            cellEls.push(cell);
        }
    }

    await Promise.all(cellEls.map(el =>
        el.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 200, easing: 'ease-out', fill: 'forwards' }
        ).finished
    ));

    // ===== Step 2: tiles fall per column, top row to bottom row, staggered =====
    const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    const ghostTiles = [];
    const fallPromises = [];

    for (let col = 0; col < ROW; col++) {
        const colDelay = col * 180; // stagger columns left to right

        for (let row = 0; row < ROW; row++) {
            const value = values[Math.floor(Math.random() * values.length)];
            const target = cellPos(row, col);
            const startTop = -sizes.tile - row * (sizes.tile + sizes.gap) - 40; // stack above board, offset per row

            const ghost = document.createElement('div');
            ghost.classList.add('piece');
            ghost.textContent = value;
            ghost.style.backgroundColor = colourScheme.getTile(value);
            ghost.style.color = colourScheme.tileText;
            ghost.style.width = `${sizes.tile}px`;
            ghost.style.height = `${sizes.tile}px`;
            ghost.style.left = `${target.left}px`;
            ghost.style.top = `${startTop}px`;
            ghost.style.opacity = '0';

            board.appendChild(ghost);
            ghostTiles.push(ghost);

            const rowDelay = colDelay + row * 90; // rows within a column fall in sequence

            const fallAnim = ghost.animate(
                [
                    { top: `${startTop}px`, opacity: 0 },
                    { top: `${startTop}px`, opacity: 1, offset: 0.01 },
                    { top: `${target.top - 15}px`, opacity: 1, offset: 0.75 }, // overshoot slightly
                    { top: `${target.top}px`, opacity: 1 }
                ],
                { duration: 420, delay: rowDelay, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }
            ).finished;

            fallPromises.push(
                fallAnim.then(() =>
                    ghost.animate(
                        [
                            { transform: 'scaleY(0.8) scaleX(1.1)' },
                            { transform: 'scaleY(1.1) scaleX(0.95)' },
                            { transform: 'scale(1)' }
                        ],
                        { duration: 200, easing: 'ease-out', fill: 'forwards' }
                    ).finished
                )
            );
        }
    }

    await Promise.all(fallPromises);
    await pause(200);

    // ===== Step 3: flash + clear everything =====
    const flash = board.animate(
        [
            { filter: 'brightness(1)' },
            { filter: 'brightness(2)' },
            { filter: 'brightness(1)' }
        ],
        { duration: 300, easing: 'ease-in-out' }
    ).finished;

    const clears = [...cellEls, ...ghostTiles].map(el =>
        el.animate(
            [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.6)' }
            ],
            { duration: 250, easing: 'ease-in', fill: 'forwards' }
        ).finished
    );

    await Promise.all([flash, ...clears]);

    cellEls.forEach(el => el.remove());
    ghostTiles.forEach(el => el.remove());
}