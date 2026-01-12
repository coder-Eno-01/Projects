const storedTheme = localStorage.getItem('theme');
let currentTheme = storedTheme !== null ? Number(storedTheme) : 0;
const changeTheme = document.querySelectorAll('.changeTheme');
let colourScheme;

function renderTheme(){
    switch(currentTheme){
        case 0:
            changeTheme[0].style.display = 'none';
            changeTheme[1].style.display = 'inline-block';

            colourScheme = {
                base: '#e0e1dd',
                second: '#415a77',
                third: '#0d1b2a',
                boardBackground: '#9caac3',
                cells: '#8a98b0',

                tiles: {
                    2: '#edf2f8',
                    4: '#cfddee',
                    8: '#9fbad9',
                    16: '#6f8fb3',
                    32: '#4f7f8c',
                    64: '#2f6f5f',
                    128: '#3b7f3b',
                    256: '#6b6bb3',
                    512: '#563d7c',
                    1024: '#1b263b',
                    2048: '#0d1b2a'
                },
                getTile(value){ return this.tiles[value]; },

                scoreBoardBackground: '#0d1b2a',
                scoreBoxes: '#778da9',
                scoreHeading: '#e0e1dd',
                scoreValue: '#ffffff',
                scoreBorder: '#e0e1dd'
            };
            break;

        case 1:
            changeTheme[0].style.display = 'inline-block';
            changeTheme[1].style.display = 'inline-block';

            colourScheme = {
                // Base surfaces
                base: '#040d12',          // page background (near-black blue)
                second: '#183d3d',        // buttons / accents
                third: '#000000',         // deep panels (themes, footer)

                // Board
                boardBackground: '#183d3d',
                cells: '#5c8374',

                // Tiles (muted, readable, premium)
                tiles: {
                    2:    '#93b1a6',
                    4:    '#7fa79a',
                    8:    '#6b9a8b',
                    16:   '#5c8374',
                    32:   '#4f7266',
                    64:   '#3f5f57',
                    128:  '#3e3636',
                    256:  '#2e2a2a',
                    512:  '#1f1c1c',
                    1024: '#121010',
                    2048: '#000000'
                },
                getTile(value){ return this.tiles[value]; },

                // Scoreboard (clear hierarchy)
                scoreBoardBackground: '#000000',
                scoreBoxes: '#183d3d',
                scoreHeading: '#93b1a6',
                scoreValue: '#f5eded',
                scoreBorder: '#5c8374',

                // Accent (use sparingly in animations / highlights)
                accent: '#d72323'
            };
            break;

        case 2:
            changeTheme[0].style.display = 'inline-block';
            changeTheme[1].style.display = 'inline-block';

            colourScheme = {
                base: '#f5ede8',
                second: '#3a1f1f',
                third: '#7a4a3a',
                boardBackground: '#e3cfc5',
                cells: '#d6b6a8',

                tiles: {
                    2: '#fdf4f1',
                    4: '#f8e0d6',
                    8: '#f2c6b8',
                    16: '#e9a38d',
                    32: '#df7f63',
                    64: '#d65c3a',
                    128: '#b8442e',
                    256: '#933326',
                    512: '#6f241d',
                    1024: '#4a1815',
                    2048: '#2b0f0d'
                },
                getTile(value){ return this.tiles[value]; },

                scoreBoardBackground: '#3a1f1f',
                scoreBoxes: '#7a4a3a',
                scoreHeading: '#f5ede8',
                scoreValue: '#ffffff',
                scoreBorder: '#2b0f0d'
            };
            break;

        case 3:
            changeTheme[0].style.display = 'inline-block';
            changeTheme[1].style.display = 'inline-block';

            colourScheme = {
                base: '#0a0a0f',
                second: '#e6e6ff',
                third: '#9fa8ff',

                boardBackground: '#141426',
                cells: '#1f1f33',

                tiles: {
                    2: '#1e90ff',
                    4: '#00bfff',
                    8: '#00ffff',
                    16: '#00ff9c',
                    32: '#7cff00',
                    64: '#ffee00',
                    128: '#ffae00',
                    256: '#ff6f00',
                    512: '#ff3cac',
                    1024: '#b23cff',
                    2048: '#6a00ff'
                },
                getTile(value){ return this.tiles[value]; },

                // 🔑 Key changes here
                scoreBoardBackground: '#1b1b2f',
                scoreBoxes: '#26264a',
                scoreHeading: '#bfc6ff',
                scoreValue: '#ffffff',
                scoreBorder: '#3b3b6a'
            };
            break;

        case 4:
            changeTheme[0].style.display = 'inline-block';
            changeTheme[1].style.display = 'inline-block';

            colourScheme = {
                base: '#0f0f0f',
                second: '#232d3f',
                third: '#005b41',

                boardBackground: '#232d3f',
                cells: '#005b41',

                tiles: {
                    2:    '#008170',
                    4:    '#007a68',
                    8:    '#006e5f',
                    16:   '#005b41',
                    32:   '#004737',
                    64:   '#00362a',
                    128:  '#232d3f',
                    256:  '#1a1f2b',
                    512:  '#121620',
                    1024: '#0b0e15',
                    2048: '#000000'
                },
                getTile(value){ return this.tiles[value]; },

                scoreBoardBackground: '#000000',
                scoreBoxes: '#232d3f',
                scoreHeading: '#008170',
                scoreValue: '#ffffff',
                scoreBorder: '#005b41',

                accent: '#008170'
            };
            break;
            
        case 5:
            changeTheme[0].style.display = 'inline-block';
            changeTheme[1].style.display = 'none';

            colourScheme = {
                base: '#000000',
                second: '#3e432e',
                third: '#616f39',

                boardBackground: '#3e432e',
                cells: '#616f39',

                tiles: {
                    2:    '#a7d129',
                    4:    '#9cc226',
                    8:    '#8fb51f',
                    16:   '#7ea417',
                    32:   '#6f8f14',
                    64:   '#616f39',
                    128:  '#3e432e',
                    256:  '#2f3322',
                    512:  '#1f2216',
                    1024: '#14160e',
                    2048: '#000000'
                },
                getTile(value){ return this.tiles[value]; },

                scoreBoardBackground: '#000000',
                scoreBoxes: '#3e432e',
                scoreHeading: '#a7d129',
                scoreValue: '#ffffff',
                scoreBorder: '#616f39',

                accent: '#a7d129'
            };
            break;

        default:
            changeTheme[0].style.display = 'none';
            changeTheme[1].style.display = 'inline-block';

            colourScheme = {
                background: '#e0e1dd',
                primaryText: '#0d1b2a',
                secondaryText: '#415a77',
                boardBackground: '#9caac3',
                cells: '#8a98b0',

                tiles: {
                    2: '#edf2f8',
                    4: '#cfddee',
                    8: '#9fbad9',
                    16: '#6f8fb3',
                    32: '#4f7f8c',
                    64: '#2f6f5f',
                    128: '#3b7f3b',
                    256: '#6b6bb3',
                    512: '#563d7c',
                    1024: '#1b263b',
                    2048: '#0d1b2a'
                },
                getTile(value){ return this.tiles[value]; },

                scoreBoardBackground: '#0d1b2a',
                scoreBoxes: '#778da9',
                scoreHeading: '#e0e1dd',
                scoreValue: '#ffffff',
                scoreBorder: '#e0e1dd'
            };
            break;
    }
    loadTheme();
}

function setTheme(value){
    if (value < 0){
        value = 0;
    }

    else if (value > 5){
        value = 5;
    }

    currentTheme = value;
    localStorage.setItem('theme', value);
}

changeTheme[0].onclick = function(){
    setTheme(currentTheme - 1);
    renderTheme();
}

changeTheme[1].onclick = function(){
    setTheme(currentTheme + 1);
    renderTheme();
}

function loadTheme(){
    document.querySelector('body').style.background = colourScheme.base;

    //Score Board
    const sb = document.querySelector('#scoreBoard');
    sb.style.backgroundColor = colourScheme.scoreBoardBackground;
    sb.style.borderColor = colourScheme.scoreBorder;

    // Score boxes
    document.querySelectorAll('#scoreBoard div').forEach(box => {
        box.style.backgroundColor = colourScheme.scoreBoxes;
        box.style.borderColor = colourScheme.scoreBorder;
    });

    // Score headings (Score / Best)
    document.querySelectorAll('#scoreBoard h2').forEach(h => {
        h.style.color = colourScheme.scoreHeading;
    });

    // Score values (numbers)
    document.querySelectorAll('#scoreBoard h3').forEach(h => {
        h.style.color = colourScheme.scoreValue;
    });


    // Special Buttons
    document.querySelectorAll('.SPB').forEach(button => {
        button.style.backgroundColor = colourScheme.second;
        button.style.color = colourScheme.base;
        button.style.borderColor = colourScheme.scoreBorder;
    })

    // Board
    board.style.backgroundColor = colourScheme.boardBackground;
    board.style.borderColor = colourScheme.scoreBorder;
    document.querySelectorAll('.cell').forEach(cell => cell.style.backgroundColor = colourScheme.cells)

    document.querySelectorAll('.piece').forEach(piece => {
        piece.style.backgroundColor = colourScheme.getTile(piece.tile.value)

        if (piece.tile.value === 2048 && colourScheme.accent) {
            piece.style.boxShadow = `0 0 20px ${colourScheme.accent}`;
            piece.style.borderColor = colourScheme.accent;
        }
    });

    // New Game
    newGame.style.backgroundColor = colourScheme.boardBackground
    newGame.style.borderColor = colourScheme.scoreBorder;
    newGame.style.color = colourScheme.scoreBoardBackground;

    // Theme Change
    document.querySelector('#themes').style.backgroundColor = colourScheme.third;
    document.querySelector('#themes h3').style.color = colourScheme.base;
    changeTheme[0].style.color = colourScheme.base;
    changeTheme[1].style.color = colourScheme.base;

    // Footer 
    const footer = document.querySelector('footer');
    footer.style.backgroundColor = colourScheme.third;
    footer.style.color = colourScheme.base;
    footer.style.borderTop = `1px solid ${colourScheme.second}`;
    footer.style.boxShadow = `0 -4px 12px rgba(204, 193, 193, 0.35)`;

    // Leaderboard
    lboardButton.style.backgroundColor = colourScheme.second;
    lboardButton.style.borderColor = colourScheme.scoreBorder;

    lboard.style.backgroundColor = colourScheme.third;
    document.querySelectorAll('.leader').forEach(leader => {
        leader.style.backgroundColor = colourScheme.scoreBoxes;
        leader.style.borderColor = colourScheme.scoreBorder;
    })

    const player = document.querySelector('#leadingPlayer');
    player.style.border = `2px solid ${colourScheme.scoreBoxes}`;
}

function tileColours(){
    for (let tile of grid.getTiles()){
        tile.element.style.backgroundColor = colourScheme.getTile(tile.value);
    }
}