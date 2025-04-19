document.addEventListener('DOMContentLoaded', () => {
    // Add retro boot sequence effect
    const bootSequence = async () => {
        const header = document.querySelector('.page-header');
        header.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 200));
        header.style.opacity = '1';
        header.style.transition = 'opacity 0.5s ease';

        // Add glitch effect on page load
        setTimeout(() => {
            document.body.style.filter = 'brightness(2) contrast(2)';
            setTimeout(() => {
                document.body.style.filter = 'none';
                document.body.style.transition = 'filter 0.2s ease';
            }, 100);
        }, 300);
    };

    bootSequence();
    fetchGames();

    // Feature 4: Set up WebSocket connection for real-time updates
    setupWebSocketConnection();

    // Function to establish WebSocket connection
    function setupWebSocketConnection() {
        const socket = io();
        
        // Listen for game added event
        socket.on('gameAdded', (path) => {
            console.log(`Game added: ${path}`);
            showNotification('New game detected', 'Updating game list...');
            fetchGames();
        });
        
        // Listen for game removed event
        socket.on('gameRemoved', (path) => {
            console.log(`Game removed: ${path}`);
            showNotification('Game removed', 'Updating game list...');
            fetchGames();
        });
        
        // Handle connection status
        socket.on('connect', () => {
            console.log('Real-time updates connected');
            document.getElementById('connection-status').classList.add('connected');
            document.getElementById('connection-status').setAttribute('title', 'Real-time updates connected');
        });
        
        socket.on('disconnect', () => {
            console.log('Real-time updates disconnected');
            document.getElementById('connection-status').classList.remove('connected');
            document.getElementById('connection-status').setAttribute('title', 'Real-time updates disconnected');
        });
    }
    
    // Function to show notification
    function showNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate notification in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after a delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Function to fetch games from our API
    async function fetchGames() {
        try {
            const response = await fetch('/api/games');
            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }
            const games = await response.json();

            // Add a slight delay for the loading animation
            setTimeout(() => {
                displayGames(games);
            }, 800);
        } catch (error) {
            console.error('Error fetching games:', error);
            document.getElementById('games-container').innerHTML = `
                <div class="col-12">
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>SYSTEM ERROR</h3>
                        <p>Could not load game data. Please check your connection and try again.</p>
                        <div class="mt-3">
                            <code>ERROR CODE: 0x45RR</code>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Function to display the games on the page
    function displayGames(games) {
        const container = document.getElementById('games-container');

        // Update game count
        document.getElementById('game-count').textContent = games.length;

        if (games.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-message">
                        <i class="fas fa-folder-open"></i>
                        <h3>NO GAMES FOUND</h3>
                        <p>Insert game disks (ZIP files) to the games folder.</p>
                        <div class="mt-3">
                            <code>PATH: C:\\GAMES\\</code>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Clear loading spinner
        container.innerHTML = '';

        // Create a card for each game
        games.forEach((game, index) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';

            // Stagger the animation for each card
            gameCard.style.opacity = "0";
            gameCard.style.transform = "translateY(20px)";
            gameCard.style.transition = `all 0.3s ease ${index * 0.1}s`;

            // Use the cover path provided by the backend
            const coverPath = game.coverPath;

            // Mark the first two games as "Top Games" for visual interest
            const topGameBadge = index < 2 ?
                `<div class="top-game-badge">Top Game</div>` : '';

            gameCard.innerHTML = `
                ${topGameBadge}
                <div class="game-image-container">
                    <img src="${coverPath}" alt="${game.name}" class="game-image" onerror="this.src='/placeholder.jpg'">
                </div>
                <div class="game-info">
                    <div class="game-name">${game.name}</div>
                    <button class="play-button" data-game-path="${game.path}">
                        <i class="fas fa-play"></i> PLAY
                    </button>
                </div>
            `;

            container.appendChild(gameCard);

            // Trigger animation after a small delay
            setTimeout(() => {
                gameCard.style.opacity = "1";
                gameCard.style.transform = "translateY(0)";
            }, 100);
        });

        // Add event listeners to play buttons (will be implemented in Feature 5)
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function () {
                const gamePath = this.getAttribute('data-game-path');
                console.log(`Play button clicked for game: ${gamePath}`);

                // Add click effect
                this.style.transform = "scale(0.95)";
                setTimeout(() => {
                    this.style.transform = "";
                }, 150);

                // Screen flash effect when game is started (placeholder for Feature 5)
                document.body.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 150);

                // This will be implemented in Feature 5
            });
        });
    }
});