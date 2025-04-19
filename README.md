# WebDOS

A web application for running classic DOS games directly in your browser. WebDOS automatically detects DOS games in ZIP format and presents them in a clean, responsive interface.

## Features

- **Automatic Game Detection**: Place DOS game ZIP files in the `games` folder, and they'll be automatically detected and displayed
- **Responsive Design**: Clean, modern interface that works on desktop, tablet, and mobile devices
- **Real-time Updates**: Games list updates automatically when new games are added without requiring page refresh
- **Game Covers**: Displays game covers from the `covers` folder or falls back to a placeholder image

## Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

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

3. Start the server:

```bash
npm start
```

4. Open your browser and navigate to:

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
3. The server will automatically detect the new games

## Adding Custom Cover Images

1. Create a JPG image for the game cover
2. Name it exactly the same as the game ZIP file (without the .zip extension)
3. Place it in the `covers` folder
4. The cover will automatically be displayed for the corresponding game

Example:
- Game file: `games/DOOM.zip`
- Cover file: `covers/DOOM.jpg`

## Project Structure

- `server.js` - The main Express server that serves the application
- `public/` - Contains static files served to the browser
  - `index.html` - The main frontend interface
  - `placeholder.jpg` - Default image used when a cover isn't available
- `games/` - Folder to store DOS game ZIP files
- `covers/` - Folder to store game cover images

## Future Enhancements

As outlined in the specification document:
- Integration with js-dos to play games directly in the browser
- Improved cover image fetching from online sources
- Enhanced user interface with filtering and search capabilities

## License

This project is licensed under the ISC License - see the package.json file for details.

## Acknowledgements

- Express.js for the server framework
- chokidar for file watching capabilities
- Cover Browser (https://www.coverbrowser.com/covers/dos-games) for cover art reference