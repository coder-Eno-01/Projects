const lboardButton = document.querySelector('#leaderboard');
const changeIcon = document.querySelector('#changeIcon');
const lboard = document.querySelector('#LeaderBoard');
const API_BASE = "https://backends-nxj9.onrender.com/2048/api";
let hideLboard = true;
let changeIconTimer;
let timerRunning = false;

const ICONS = {
    icons: [
        'default_profile',
        'batman_dark',
        'batman_light',
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
    currentIcon: null,
    iconNext: function (){
        this.currentIcon = (this.currentIcon >= ICONS.numIcons() - 1) ? 0 : ++this.currentIcon;
    }
}

function leaderboard(){
    const themesSize = document.querySelector('#themes').clientWidth;

    lboardButton.style.left = `${themesSize + 11}px`;
}

lboardButton.onclick = async function(){
    if (playerName === PLAYER_INFO.DEFAULT_NAME){
        result = window.prompt(`Player name is currently default tag: ${playerName}\nEnter new name to change it or leave empty to continue`);

        if (result){
            playerName = result;
            localStorage.setItem('playerName', playerName);
        }
    }

    if(hideLboard){
        loadingDiv.classList.remove('hidden');

        await syncHighScore();
        const data = await fetchFromDB();
        loadingDiv.classList.add('hidden');
        populateLeaderboard(data);

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

async function fetchFromDB(attempt = 1, onlyFetchPlayer = false) {

    PLAYER_INFO.update(await fetch(`${API_BASE}/player/${CLIENT_UID}`)
                                .then(response => response.json())
                                .catch(err => null));

    if (onlyFetchPlayer) return PLAYER_INFO.player !== null;     // True means player pre-exists in DB

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
            return fetchFromDB(++attempt);
        }
    });

    return data;
}

async function submitData(playerName, score, UID = CLIENT_UID, icon_ID = iconManager.currentIcon) {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playerName,
            score,
            clientUid: UID,
            iconID: icon_ID
        })

    });

    return response.json();
}

function populateLeaderboard(scores) {
    if (!scores || scores.length === 0) return;

    // ===== Leading player =====
    const leading = scores[0];

    loadIcon(true. leading.iconID);
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
    if (getClientUID() !== leading.clientUid && PLAYER_INFO?.role !== "DEVELOPER") changeIcon.style.display = 'none';

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

function loadIcon(firstTime = false, iconID){
    if (!firstTime){
        iconManager.iconNext();
    }
    else{
        iconManager.currentIcon = iconID ?? 0;
    }
    document.querySelector('#playerIcon img').src = `assets/${ICONS.icons[iconManager.currentIcon]}.svg`;
}

changeIcon.onclick = async function() {
    loadIcon();

    // Change Icon in DB if no change happens after 3 seconds
    if (!timerRunning) startTimer();
    else stopTimer();
    
}

async function startTimer(){
    timerRunning = true;
    changeIconTimer = setTimeout(() => {
        submitData(playerName, score[1], icon_ID = iconManager.currentIcon);
    }, 3000);
}

async function stopTimer(){
    clearTimeout(changeIconTimer);
}








