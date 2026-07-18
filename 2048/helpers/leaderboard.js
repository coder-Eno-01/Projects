const lboardButton = document.querySelector('#leaderboard');
const changeIcon = document.querySelector('#changeIcon');
const lboard = document.querySelector('#LeaderBoard');
const API_BASE = "https://backends-nxj9.onrender.com/2048/api";
let hideLboard = true;

const ICONS = {
    icons: [
        'default_profile',
        'batman_black',
        'batman_white',
        'batman_face',
        'queen',
        'flower1',
        'flower2',
        'butterfly',
        'cat_dark',
        'cat_light',
        'panda',
        'football',
        'brain',
        'alien1',
        'alien2',
        'astronaut'

    ],
    numIcons: function (){return this.icons.length;}
}

const iconManager = {
    currentIcon: Number(localStorage.getItem('leadingPlayerIcon')) ?? 0,
    iconNext: function (){
        this.currentIcon = (this.currentIcon >= ICONS.numIcons() - 1) ? 0 : ++this.currentIcon;
    }
}

loadIcon(true);

function leaderboard(){
    const themesSize = document.querySelector('#themes').clientWidth;

    lboardButton.style.left = `${themesSize + 11}px`;
}

lboardButton.onclick = async function(){
    if (playerName === null){
        playerName = window.prompt("You need a player name to go global!\nEnter name:");

        if (playerName === null || playerName === "") return;

        localStorage.setItem('playerName', playerName);
    }

    if(hideLboard){
        loadingDiv.classList.remove('hidden');

        await syncHighScore();
        const data = await fetchTopScores();
        loadingDiv.classList.add('hidden');
        populateLeaderboard(...data);

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

async function fetchTopScores(attempt = 1) {
    const data = await fetch(`${API_BASE}/scores/top`)
    .then(rspns => {
        if(!rspns.ok){
            throw new Error('Network response was not ok');
        } 
        else return rspns.json()
    })
    .catch(async (err) => {
        console.log(`Attempt ${attempt} failed due to ${err}. Retrying...`);
        if (attempt < 3) {
            await pause(3000); // Wait for 3 seconds before retrying
            return fetchTopScores(++attempt);
        }
    });

    const currentPlayerInfo = await fetch(`${API_BASE}/player/${CLIENT_UID}`)
                                    .then(response => response.json())
                                    .catch(err => null);

    return [data, currentPlayerInfo];
}

async function submitScore(playerName, score, UID = CLIENT_UID) {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playerName,
            score,
            clientUid: UID
        })

    });

    return response.json();
}

function populateLeaderboard(scores, currentPlayerInfo) {
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
        days === 1 ? "Yesterday" :
        `${days} days ago`;


    // Only the leading player can change their icon
    if (getClientUID() !== leading.clientUid && currentPlayerInfo?.role !== "DEVELOPER") changeIcon.style.display = 'none';

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

function loadIcon(firstTime = false){
    if (!firstTime){
        iconManager.iconNext();
    }
    document.querySelector('#playerIcon img').src = `assets/${ICONS.icons[iconManager.currentIcon]}.svg`
    localStorage.setItem('leadingPlayerIcon', iconManager.currentIcon);
}

changeIcon.onclick = async function() {
    loadIcon();
}






