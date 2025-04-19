const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Games directory path
const gamesDir = path.join(__dirname, 'games');

/**
 * Feature 1: Game Listing
 * Detect all .zip files in the games folder
 */
function getGamesList() {
    try {
        // Check if games directory exists
        if (!fs.existsSync(gamesDir)) {
            console.warn('Games directory not found. Creating it...');
            fs.mkdirSync(gamesDir, { recursive: true });
            return [];
        }

        // Read all files from games directory
        const files = fs.readdirSync(gamesDir);

        // Filter for .zip files only
        const zipFiles = files.filter(file => path.extname(file).toLowerCase() === '.zip');

        // Create game objects with name derived from filename (without extension)
        const games = zipFiles.map(file => {
            return {
                name: path.basename(file, '.zip'),
                filename: file,
                path: `/games/${file}`
            };
        });

        console.log(`Found ${games.length} games in the games directory`);
        return games;
    } catch (error) {
        console.error('Error reading games directory:', error);
        return [];
    }
}

// API endpoint to get list of games
app.get('/api/games', (req, res) => {
    const games = getGamesList();
    res.json(games);
});

// Serve games files
app.use('/games', express.static(path.join(__dirname, 'games')));

// Default route to serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up file watcher for the games directory
const watcher = chokidar.watch(gamesDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

// Log file changes
watcher
    .on('add', path => console.log(`Game added: ${path}`))
    .on('unlink', path => console.log(`Game removed: ${path}`))
    .on('error', error => console.error(`Watcher error: ${error}`));

console.log(`Watching for changes in the games directory: ${gamesDir}`);