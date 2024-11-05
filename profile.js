// Assuming the token is stored in localStorage
const token = localStorage.getItem('access_token');

// Replace 'userId' with the current logged-in user's username, if stored
// Alternatively, fetch this from your backend if it's available there
const username = localStorage.getItem('username');  // Set this from your app's login or profile retrieval logic

// URLs for API endpoints (adjust according to actual API paths)
const apiMoodLogsUrl = 'http://127.0.0.1:8000/api/profile/moodlogs/';
const apiFriendsUrl = 'http://127.0.0.1:8000/api/profile/friends/';
const apiLeaderboardUrl = 'http://127.0.0.1:8000/api/profile/leaderboard/';

// Pagination variables
let currentPage = 1;
const itemsPerPage = 6;
let totalMoodLogs = [];

// Fetch and display mood logs
async function fetchMoodLogs() {
    try {
        const response = await fetch(apiMoodLogsUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        totalMoodLogs = await response.json();
        displayMoodLogs();
        updatePaginationControls();
    } catch (error) {
        console.error('Error fetching mood logs:', error);
    }
}

function displayMoodLogs() {
    const moodLogsList = document.getElementById('moodLogsList');
    moodLogsList.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageLogs = totalMoodLogs.slice(startIndex, endIndex);

    currentPageLogs.forEach(log => {
        const moodBlock = document.createElement('div');
        moodBlock.className = `mood-log-block mood-${log.mood_type.toLowerCase()}`;
        
        const date = new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        moodBlock.innerHTML = `
            <h3>${log.mood_type.charAt(0).toUpperCase() + log.mood_type.slice(1)}</h3>
            <p>${date}</p>
            <div class="mood-intensity">
                ${Array(5).fill().map((_, i) => `<span class="intensity-dot" style="opacity: ${i < log.intensity ? 1 : 0.3}"></span>`).join('')}
            </div>
            <p>${log.context}</p>
        `;
        
        moodLogsList.appendChild(moodBlock);
    });
}

function updatePaginationControls() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    const totalPages = Math.ceil(totalMoodLogs.length / itemsPerPage);

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayMoodLogs();
        updatePaginationControls();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(totalMoodLogs.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayMoodLogs();
        updatePaginationControls();
    }
});

// Fetch and display friends list
async function fetchFriends() {
    try {
        const response = await fetch(apiFriendsUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        const friendsList = document.getElementById('friendsList');
        friendsList.innerHTML = '';

        data.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.textContent = friend.username;
            friendsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching friends:', error);
    }
}

// Add a new friend
document.getElementById('addFriendBtn').addEventListener('click', async () => {
    const friendUsername = document.getElementById('addFriendInput').value;
    if (!friendUsername || !username) return;

    try {
        const response = await fetch(apiFriendsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                friend_user: friendUsername // The username of the friend to add
            })
        });

        if (response.ok) {
            alert('Friend added successfully!');
            fetchFriends();
        } else {
            alert('Error adding friend');
        }
    } catch (error) {
        console.error('Error adding friend:', error);
    }
});

// Fetch and display leaderboard
async function fetchLeaderboard() {
    try {
        const response = await fetch(apiLeaderboardUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        data.forEach((user, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${user.username} - ${user.score} points`;
            leaderboardList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

// Mini-nav functionality
const miniNavButtons = document.querySelectorAll('.mini-nav-btn');
const contentSections = document.querySelectorAll('.content-section');

miniNavButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        
        miniNavButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// Initialize by fetching all data
fetchMoodLogs();
fetchFriends();
fetchLeaderboard();
