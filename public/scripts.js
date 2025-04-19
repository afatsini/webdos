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

        // Feature 5: Add event listeners to play buttons to run games using jsDOS
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function () {
                const gamePath = this.getAttribute('data-game-path');
                const gameName = gamePath.split('/').pop().replace('.zip', '');
                console.log(`Running game: ${gameName}`);

                // Add click effect
                this.style.transform = "scale(0.95)";
                setTimeout(() => {
                    this.style.transform = "";
                }, 150);

                // Screen flash effect when game is started
                document.body.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 150);

                // Create a modal to display the game
                launchGameModal(gamePath, gameName);
            });
        });
    }

    // Feature 5: Function to launch game in a modal using jsDOS
    function launchGameModal(gamePath, gameName) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'game-modal-overlay fullscreen-modal';
        modalOverlay.innerHTML = `
            <div class="game-modal">
                <div class="game-modal-header">
                    <div class="game-modal-title">${gameName}</div>
                    <button class="game-modal-close">&times;</button>
                </div>
                <div class="game-modal-content">
                    <div class="dos-container" id="dos-container"></div>
                </div>
                <div class="game-modal-footer">
                    <div class="game-controls">
                        <button class="fullscreen-btn" title="Toggle Fullscreen"><i class="fas fa-expand"></i></button>
                        <button class="restart-btn" title="Restart Game"><i class="fas fa-redo"></i></button>
                    </div>
                    <div class="game-modal-info">Press ESC to access game menu</div>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Add event listener to close button
        const closeButton = modalOverlay.querySelector('.game-modal-close');
        closeButton.addEventListener('click', () => {
            // Remove DOS instance
            if (window.dosInstance) {
                try {
                    window.dosInstance.exit();
                } catch (e) {
                    console.error('Error exiting DOS instance:', e);
                }
                window.dosInstance = null;
            }

            // Remove modal from DOM with animation
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                modalOverlay.remove();
            }, 300);
        });

        // Animate modal appearing
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
        }, 10);

        // Initialize jsDOS
        const dosContainer = modalOverlay.querySelector('#dos-container');
        const loadingIndicator = modalOverlay.querySelector('.loading-indicator');
        const loadingProgress = modalOverlay.querySelector('.loading-progress');

        // Initialize jsDOS with the game path directly in the configuration
        console.log(`Loading game from: ${gamePath}`);

        // Add a safety timeout to hide the loading indicator if onrun is never called
        const loadingTimeout = setTimeout(() => {
            loadingIndicator.style.display = 'none';
            console.log('Loading timeout reached - hiding loading indicator');
            showNotification('DOS Emulator', 'Game loaded with timeout');
        }, 10000); // 10 second timeout as failsafe

        try {
            window.dosInstance = Dos(dosContainer, {
                wdosboxUrl: "https://v8.js-dos.com/latest/wdosbox.js",
                url: gamePath,  // Pass the game URL directly in the config
                onprogress: (stage, total, loaded) => {
                    const percent = Math.floor(loaded * 100 / total);
                    loadingProgress.style.width = percent + '%';

                    if (stage === 'Downloading' && loaded >= total) {
                        loadingIndicator.querySelector('.loading-text').textContent = 'Starting emulation...';
                    }
                },
                onrun: () => {
                    // Game is loaded and running
                    console.log('Game started successfully');
                    loadingIndicator.style.display = 'none';
                    clearTimeout(loadingTimeout); // Clear the timeout since onrun was called
                    showNotification('DOS Emulator', 'Game started successfully');
                },
                onerror: (error) => {
                    console.error('Failed to start game:', error);
                    loadingIndicator.querySelector('.loading-text').textContent = 'Failed to start game. Please try again.';
                    loadingProgress.style.width = '0%';
                    loadingProgress.style.backgroundColor = 'red';
                    clearTimeout(loadingTimeout); // Clear the timeout on error
                    showNotification('Error', 'Failed to start game. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error initializing DOS instance:', error);
            loadingIndicator.querySelector('.loading-text').textContent = 'Error initializing emulator. Please try again.';
            loadingProgress.style.backgroundColor = 'red';
            clearTimeout(loadingTimeout); // Clear the timeout on error
            showNotification('Error', 'Failed to initialize DOS emulator');
        }

        // Setup fullscreen button
        const fullscreenBtn = modalOverlay.querySelector('.fullscreen-btn');
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                dosContainer.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });

        // Setup restart button
        const restartBtn = modalOverlay.querySelector('.restart-btn');
        restartBtn.addEventListener('click', () => {
            if (window.dosInstance) {
                try {
                    // For restarting, we need to remove the old instance and create a new one
                    // First, try to exit the current instance
                    try {
                        window.dosInstance.exit();
                    } catch (e) {
                        console.error('Error exiting DOS instance:', e);
                    }

                    // Show loading again
                    loadingIndicator.style.display = 'block';
                    loadingProgress.style.width = '0%';
                    loadingProgress.style.backgroundColor = '#0f0';
                    loadingIndicator.querySelector('.loading-text').textContent = 'Restarting game...';

                    // Create a new instance
                    window.dosInstance = Dos(dosContainer, {
                        wdosboxUrl: "https://v8.js-dos.com/latest/wdosbox.js",
                        url: gamePath,
                        onprogress: (stage, total, loaded) => {
                            const percent = Math.floor(loaded * 100 / total);
                            loadingProgress.style.width = percent + '%';
                        },
                        onrun: () => {
                            loadingIndicator.style.display = 'none';
                        },
                        onerror: (error) => {
                            console.error('Error restarting game:', error);
                            loadingIndicator.querySelector('.loading-text').textContent = 'Failed to restart game';
                            loadingProgress.style.backgroundColor = 'red';
                        }
                    });
                } catch (error) {
                    console.error('Error restarting game:', error);
                    loadingIndicator.querySelector('.loading-text').textContent = 'Failed to restart game';
                    loadingProgress.style.backgroundColor = 'red';
                }
            }
        });
    }
});