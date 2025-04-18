// Constants and configuration
const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const CLUB_ID = 862;
let MATCH_ID = 677; // Default match ID, can be changed

// Main function to fetch and process cricket data
async function loadMatchData() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const scoreboardEl = document.getElementById('scoreboard');
    const batsmenInfoEl = document.getElementById('batsmen-info');
    const bowlerInfoEl = document.getElementById('bowler-info');
    const ballByBallContainerEl = document.getElementById('ballByBallContainer');

    // Show loading, hide error and content
    loadingEl.innerHTML = '<div class="loading">Loading match details...</div>';
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    scoreboardEl.style.display = 'none';
    batsmenInfoEl.style.display = 'none';
    bowlerInfoEl.style.display = 'none';
    ballByBallContainerEl.style.display = 'none';


    try {
        // Create the target URL
        const targetUrl = `https://cricclubs.com/FT20/ballbyball.do?matchId=${MATCH_ID}&clubId=${CLUB_ID}`;
        const encodedTargetUrl = encodeURIComponent(targetUrl);
        const fullUrl = PROXY_URL + encodedTargetUrl;

        // Fetch data
        const response = await fetch(fullUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const html = await response.text();

        // Process the HTML to extract data
        processMatchData(html);

        // Hide loading indicator after successful processing
        loadingEl.style.display = 'none';

    } catch (error) {
        console.error('Error loading match data:', error);
        loadingEl.style.display = 'none'; // Hide loading indicator
        errorEl.textContent = `Error loading match data: ${error.message}. Please check the Match ID or try again later.`;
        errorEl.style.display = 'block'; // Show error message
    }
}

// Process the HTML to extract match data
function processMatchData(html) {
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract data (Your existing extraction functions remain the same)
    const battingTeam = extractBattingTeam(doc);
    const bowlingTeam = extractBowlingTeam(doc);
    const currentScore = extractCurrentScore(doc);
    const currentOvers = extractCurrentOvers(doc);
    const batsmen = extractBatsmen(doc);
    const currentBowler = extractCurrentBowler(doc);
    const ballByBall = extractBallByBall(doc);

    // Update the UI with extracted data
    updateUI(battingTeam, bowlingTeam, currentScore, currentOvers, batsmen, currentBowler, ballByBall);
}

// --- Your existing extraction functions go here ---
// extractBattingTeam(doc)
// extractBowlingTeam(doc)
// extractCurrentScore(doc)
// extractCurrentOvers(doc)
// extractBatsmen(doc)
// extractCurrentBowler(doc)
// extractBallByBall(doc)
// --- Keep them as they are ---


// NEW FUNCTION: Update the UI with the processed data
function updateUI(battingTeam, bowlingTeam, currentScore, currentOvers, batsmen, currentBowler, ballByBall) {
    // --- Scoreboard ---
    document.getElementById('battingTeamName').textContent = battingTeam;
    document.getElementById('bowlingTeamName').textContent = bowlingTeam;
    document.getElementById('currentScore').textContent = currentScore;
    document.getElementById('currentOvers').textContent = currentOvers;
    document.getElementById('scoreboard').style.display = 'flex'; // Show scoreboard

    // --- Batsmen ---
    const batsmenTableBody = document.getElementById('batsmenTable').querySelector('tbody');
    batsmenTableBody.innerHTML = ''; // Clear previous batsmen
    batsmen.forEach(batter => {
        const row = batsmenTableBody.insertRow();
        row.insertCell().textContent = batter.name;
        row.insertCell().textContent = batter.runs;
        row.insertCell().textContent = batter.balls;
        if (batter.isStriker) {
            row.classList.add('striker'); // Add class to highlight striker
        }
    });
    document.getElementById('batsmen-info').style.display = 'block'; // Show batsmen info

    // --- Bowler ---
    const bowlerTableBody = document.getElementById('bowlerTable').querySelector('tbody');
    bowlerTableBody.innerHTML = ''; // Clear previous bowler
    const bowlerRow = bowlerTableBody.insertRow();
    bowlerRow.insertCell().textContent = currentBowler.name;
    bowlerRow.insertCell().textContent = currentBowler.overs;
    bowlerRow.insertCell().textContent = currentBowler.maidens;
    bowlerRow.insertCell().textContent = currentBowler.runs;
    bowlerRow.insertCell().textContent = currentBowler.wickets;
    bowlerRow.insertCell().textContent = currentBowler.economy;
    document.getElementById('bowler-info').style.display = 'block'; // Show bowler info

    // --- Ball-by-Ball ---
    const commentaryFeed = document.getElementById('commentary-feed');
    commentaryFeed.innerHTML = ''; // Clear previous commentary
    if (ballByBall.length > 0) {
        ballByBall.forEach(ball => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('commentary-item');

            const ballDiv = document.createElement('div');
            ballDiv.classList.add('commentary-ball');
            ballDiv.textContent = ball.ball;

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('commentary-details');

            const runsSpan = document.createElement('span');
            runsSpan.classList.add('commentary-runs');
            // Add classes based on runs for styling
            const runsLower = ball.runs.toLowerCase();
            if (runsLower === 'w') {
                 runsSpan.classList.add('runs-W');
            } else if (runsLower === 'wd' || runsLower === 'nb') {
                 runsSpan.classList.add(`runs-${runsLower}`);
            } else if (!isNaN(parseInt(runsLower))) {
                 runsSpan.classList.add(`runs-${runsLower}`);
            } else {
                 runsSpan.classList.add('runs-other'); // Fallback
            }
            runsSpan.textContent = ball.runs;


            const textSpan = document.createElement('span');
            textSpan.classList.add('commentary-text');
            textSpan.innerHTML = ball.commentary; // Use innerHTML as commentary might contain HTML tags

            detailsDiv.appendChild(runsSpan);
            detailsDiv.appendChild(textSpan);

            itemDiv.appendChild(ballDiv);
            itemDiv.appendChild(detailsDiv);

            commentaryFeed.appendChild(itemDiv);
        });
         document.getElementById('ballByBallContainer').style.display = 'block'; // Show commentary
    } else {
         // Optionally display a message if no commentary is found
         commentaryFeed.innerHTML = '<p>No ball-by-ball commentary available yet.</p>';
         document.getElementById('ballByBallContainer').style.display = 'block';
    }

    // Hide loading/error messages if they were visible
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
}
