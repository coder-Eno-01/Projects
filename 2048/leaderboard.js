const lboardButton = document.querySelector('#leaderboard');
const lboard = document.querySelector('#LeaderBoard');
const API_BASE = "https://leaderboard-backend-m25r.onrender.com/api/scores";
let hideLboard = true;

function leaderboard(){
    const themesSize = document.querySelector('#themes').clientWidth;

    lboardButton.style.left = `${themesSize + 20}px`

    lboard.classList.remove('hidden');
    const lh = lboard.clientHeight;
    const wh = window.innerHeight;
    lboard.style.top = `${0.5 * (wh - lh)}px`
    lboard.classList.add('hidden');
}

lboardButton.onclick = function(){
    if (playerName === null){
        playerName = window.prompt("You need a player name to go global!\nEnter name:");

        if (playerName === null || playerName === "") return;
    }

    if(hideLboard){
        lboardButton.style.backgroundColor = 'hsla(163, 87%, 44%, 1.00)';
        lboard.classList.remove('hidden');
        hideLboard = false;
    }

    else{
        lboardButton.style.backgroundColor = colourScheme.second;
        lboard.classList.add('hidden');
        hideLboard = true;
    }
}

async function fetchTopScores() {
    const response = await fetch(`${API_BASE}/top`);
    return response.json();
}

async function submitScore(playerName, score) {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playerName,
            score,
            clientUid: CLIENT_UID
        })

    });

    return response.json();
}

window.fetchTopScores = fetchTopScores;
window.submitScore = submitScore;
