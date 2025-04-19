# WebDOS

A web application for running classic DOS games directly in your browser. WebDOS automatically detects DOS games in ZIP format and presents them in a clean, responsive interface.

## Features

- **Automatic Game Detection**: Place DOS game ZIP files in the `games` folder, and they'll be automatically detected and displayed
- **Responsive Design**: Clean, modern interface that works on desktop, tablet, and mobile devices
- **Real-time Updates**: Games list updates automatically when new games are added without requiring page refresh
- **Automatic Cover Images**: Fetches game covers from IGDB API based on game names and caches them locally
- **Fallback Images**: Uses local cover images when available or falls back to a placeholder image

## Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- IGDB API credentials (for automatic cover image fetching)

## Installation

1. Clone this repository or download the project files:

```bash
git clone https://github.com/yourusername/webdos.git
cd webdos
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the project root with your IGDB API credentials:
```
IGDB_CLIENT_ID=your_client_id_here
IGDB_CLIENT_SECRET=your_client_secret_here
```

You can get these credentials by:
- Creating an account at [Twitch Developers](https://dev.twitch.tv/)
- Registering a new application
- Using the Client ID and Client Secret provided for your application

4. Start the server:

```bash
npm start
```

5. Open your browser and navigate to:

```
http://localhost:3000
```

## Development Mode

To run the application in development mode with automatic server restarts:

```bash
npm run dev
```

Note: This requires [nodemon](https://www.npmjs.com/package/nodemon) to be installed. If you don't have it, you can install it globally with `npm install -g nodemon`.

## Adding Games

1. Obtain DOS games in ZIP format
2. Place the ZIP files in the `games` folder
3. The server will automatically detect the new games and fetch cover images

## Adding Custom Cover Images

WebDOS supports three methods for displaying cover images (in order of priority):

1. **Local Manually Added Covers**
   - Create a JPG image for the game cover
   - Name it exactly the same as the game ZIP file (without the .zip extension)
   - Place it in the `covers` folder

2. **Automatically Fetched Covers**
   - When no local cover exists, WebDOS will attempt to fetch one from IGDB API
   - Fetched covers are automatically saved to the `covers` folder for future use

3. **Placeholder Image**
   - If no cover can be found or fetched, a placeholder image is displayed

Example:
- Game file: `games/DOOM.zip`
- Cover file: `covers/DOOM.jpg`

## Project Structure

- `server.js` - The main Express server that serves the application
- `.env` - Environment variables (API keys, configuration settings)
- `public/` - Contains static files served to the browser
  - `index.html` - The main frontend interface
  - `placeholder.jpg` - Default image used when a cover isn't available
- `games/` - Folder to store DOS game ZIP files
- `covers/` - Folder to store game cover images (both manual and auto-fetched)

## Future Enhancements

As outlined in the specification document:
- Integration with js-dos to play games directly in the browser
- Enhanced user interface with filtering and search capabilities
- Game details pages with additional information

## License

This project is licensed under the ISC License - see the package.json file for details.

## Acknowledgements

- Express.js for the server framework
- chokidar for file watching capabilities
- IGDB API for game cover image data
- Cover Browser (https://www.coverbrowser.com/covers/dos-games) for cover art reference