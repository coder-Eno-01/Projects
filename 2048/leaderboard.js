const lboardButton = document.querySelector('#leaderboard');
const lboard = document.querySelector('#LeaderBoard');
const API_BASE = "https://leaderboard-backend-m25r.onrender.com/api/scores";
let hideLboard = true;

function leaderboard(){
    const themesSize = document.querySelector('#themes').clientWidth;

    lboardButton.style.left = `${themesSize + 13}px`;
}

lboardButton.onclick = async function(){
    if (playerName === null){
        playerName = window.prompt("You need a player name to go global!\nEnter name:");

        if (playerName === null || playerName === "") return;

        localStorage.setItem('playerName', playerName);
    }

    if(hideLboard){
        loadingDiv.classList.remove('hidden');
        const scores = await fetchTopScores();
        loadingDiv.classList.add('hidden');
        populateLeaderboard(scores);

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

function populateLeaderboard(scores) {
    if (!scores || scores.length === 0) return;

    // ===== Leading player =====
    const leading = scores[0];

    const leadingName = document.querySelector('#leadingPlayer h4');
    const leadingScore = document.querySelector("#leadingPlayer h2");
    const leadingTime = document.querySelector("#leadingPlayer h5");

    leadingName.textContent = leading.playerName === playerName ? `${leading.playerName} (You)`: leading.playerName;

    leadingScore.textContent = leading.score;

    const createdDate = new Date(leading.createdAt);
    const now = new Date();

    // difference in milliseconds
    const diffMs = now - createdDate;

    // convert to days
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    leadingTime.textContent =
        days === 0 ? "Today" :
        days === 1 ? "1 day ago" :
        `${days} days ago`;


    // ===== Other leaders =====
    const leaders = document.querySelectorAll(".leader");

    leaders.forEach((row, index) => {
        const entry = scores[index + 1];

        if (!entry) {
            row.style.display = "none";
            return;
        }

        row.style.display = "flex";
        row.querySelector(".player").textContent = entry.playerName === playerName ? `${entry.playerName} (You)` : entry.playerName;
        row.querySelector(".score").textContent = entry.score;
    });
}

