const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Setup HTTP server for socket.io
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Games directory path
const gamesDir = path.join(__dirname, 'games');
const coversDir = path.join(__dirname, 'covers');

// Ensure covers directory exists
if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
    console.log('Created covers directory');
}

// IGDB API Configuration
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
let igdbAccessToken = null;
let tokenExpiryTime = null;

/**
 * Feature 2: Image Cover - IGDB API Authentication
 * Get an access token from the IGDB API
 */
async function getIGDBAccessToken() {
    try {
        // If we have a valid token, return it
        if (igdbAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
            return igdbAccessToken;
        }

        // Otherwise, get a new token
        const response = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`
        );

        igdbAccessToken = response.data.access_token;
        // Set expiry time (subtract 1 hour to be safe)
        tokenExpiryTime = Date.now() + (response.data.expires_in - 3600) * 1000;

        console.log('New IGDB access token obtained');
        return igdbAccessToken;
    } catch (error) {
        console.error('Error getting IGDB access token:', error.message);
        return null;
    }
}

/**
 * Feature 2: Image Cover - Cover Image Fetching
 * Search for a game cover in the IGDB API
 */
async function fetchGameCover(gameName) {
    // First check if we already have a local cover
    const localCoverPath = path.join(coversDir, `${gameName}.jpg`);
    if (fs.existsSync(localCoverPath)) {
        return `/covers/${gameName}.jpg`;
    }

    try {
        // Get access token
        const token = await getIGDBAccessToken();
        if (!token) {
            return null;
        }

        // Search for the game
        const searchResponse = await axios({
            url: 'https://api.igdb.com/v4/games',
            method: 'POST',
            headers: {
                'Client-ID': IGDB_CLIENT_ID,
                'Authorization': `Bearer ${token}`
            },
            data: `search "${gameName}"; fields name,cover; limit 5;`
        });

        if (searchResponse.data.length === 0) {
            console.log(`No game found for: ${gameName}`);
            return null;
        }

        const game = searchResponse.data[0];
        if (!game.cover) {
            console.log(`No cover found for game: ${gameName}`);
            return null;
        }

        // Get cover details
        const coverResponse = await axios({
            url: 'https://api.igdb.com/v4/covers',
            method: 'POST',
            headers: {
                'Client-ID': IGDB_CLIENT_ID,
                'Authorization': `Bearer ${token}`
            },
            data: `fields url; where id = ${game.cover};`
        });

        if (coverResponse.data.length === 0) {
            console.log(`No cover details found for game: ${gameName}`);
            return null;
        }

        // Get the image URL and convert it to a larger size
        let imageUrl = coverResponse.data[0].url;
        if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
        }
        // Replace thumbnail with a larger image
        imageUrl = imageUrl.replace('t_thumb', 't_cover_big');

        // Download and save the cover
        const imageResponse = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(localCoverPath);
        imageResponse.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Cover saved for: ${gameName}`);
                resolve(`/covers/${gameName}.jpg`);
            });
            writer.on('error', (err) => {
                console.error(`Error saving cover for ${gameName}:`, err);
                reject(null);
            });
        });
    } catch (error) {
        console.error(`Error fetching cover for ${gameName}:`, error.message);
        return null;
    }
}

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

/**
 * Feature 2: Get all games with their cover images
 */
async function getGamesWithCovers() {
    const games = getGamesList();

    // Fetch covers for all games in parallel
    const gamesWithCovers = await Promise.all(games.map(async (game) => {
        const coverPath = await fetchGameCover(game.name);
        return {
            ...game,
            coverPath: coverPath || '/placeholder.jpg' // Use placeholder if no cover is found
        };
    }));

    return gamesWithCovers;
}

// API endpoint to get list of games with covers
app.get('/api/games', async (req, res) => {
    const games = await getGamesWithCovers();
    res.json(games);
});

// Serve games files
app.use('/games', express.static(path.join(__dirname, 'games')));

// Serve cover images
app.use('/covers', express.static(path.join(__dirname, 'covers')));

// Default route to serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up file watcher for the games directory
const watcher = chokidar.watch(gamesDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

// Log file changes
watcher
    .on('add', path => {
        console.log(`Game added: ${path}`);
        io.emit('gameAdded', path);
    })
    .on('unlink', path => {
        console.log(`Game removed: ${path}`);
        io.emit('gameRemoved', path);
    })
    .on('error', error => console.error(`Watcher error: ${error}`));

console.log(`Watching for changes in the games directory: ${gamesDir}`);