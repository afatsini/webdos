# Website Specification

## Overview
The website will list all the games available in the `games` folder. Each game will be displayed with its name and cover image. The cover images will be fetched from `https://www.coverbrowser.com/covers/dos-games`. For each game, there will be a play button to play the game in the browser.

## Features

### 1. **Game Listing**
- **File Detection**: Automatically detect all `.zip` files in the `games` folder. Each `.zip` file represents a game.

### 2. **Image Cover**
- **Cover Image Fetching**: Use the game name (derived from the `.zip` file name) to fetch the corresponding cover image from `https://www.coverbrowser.com/covers/dos-games`. If no cover is found, use a default placeholder image.
- **Game Display**: Display the game name and cover image in a grid layout on the frontend.
- **Reference Design**: Use `https://dosgames.com/games/` as a reference for layout and design.

### 3. **Styling**
- **CSS Framework**: Use a modern CSS framework like Tailwind CSS or Bootstrap for styling.
- **Responsive Design**: Ensure the website is fully responsive and adapts to different screen sizes, including mobile, tablet, and desktop.
- **Custom Styling**: Add custom CSS for unique design elements, such as hover effects on game cards.

### 4. **Dynamic Content**
- **Real-Time Updates**: Use JavaScript to dynamically update the game list if new `.zip` files are added to the `games` folder without requiring a page refresh.
- **File Watcher**: Implement a backend file watcher (e.g., using Node.js `fs` module) to detect changes in the `games` folder and notify the frontend via WebSocket or API.

### 5. **Play Games in Browser**
- **Emulator Integration**: Integrate `js-dos` to allow users to play games directly in the browser.
- **Emulator Setup**: Follow the `js-dos` documentation to embed the emulator and configure it to load `.zip` files.
- **Play Button**: Add a "Play" button for each game. When clicked, initialize the emulator with the selected game.
- **Performance Optimization**: Ensure the emulator runs smoothly by optimizing game loading and resource usage.

## Technical Details

### Frontend
- **Framework**: Use React.js or plain JavaScript for building the frontend.
- **State Management**: Use React Context or Redux for managing the state of the game list and emulator.
- **API Integration**: Use `fetch` or `axios` to retrieve cover images and communicate with the backend.

### Backend
- **Language**: Use Node.js for the backend.
- **File Handling**: Use the `fs` module to read the `games` folder and detect `.zip` files.
- **API Endpoints**: Create RESTful API endpoints to serve the game list and handle cover image fetching if needed.
- **WebSocket Support**: Add WebSocket support for real-time updates to the frontend when the `games` folder changes.

### Deployment
- **Hosting**: Deploy the website using a platform like Vercel, Netlify, or AWS.
- **Static Files**: Serve static files (HTML, CSS, JS) efficiently using a CDN.
- **Backend Hosting**: Use a Node.js hosting service like Heroku or AWS Lambda for the backend.

### Testing
- **Unit Testing**: Write unit tests for critical components using Jest or Mocha.
- **Integration Testing**: Test the integration between the frontend, backend, and `js-dos` emulator.
- **Browser Compatibility**: Ensure the website works on all major browsers (Chrome, Firefox, Safari, Edge).

## Implementation Steps

### Step 1: Backend Setup
1. Detect `.zip` files in the `games` folder using the Node.js `fs` module.
2. Create a function to fetch cover images from `https://www.coverbrowser.com/covers/dos-games`.
3. Set up a RESTful API to serve the game list and cover image URLs to the frontend.

### Step 2: Frontend Setup
1. Build a grid layout to display game names and cover images.
2. Add a "Play" button for each game.
3. Integrate the `js-dos` emulator to load and play `.zip` files.

### Step 3: Real-Time Updates
1. Implement a file watcher on the backend to detect changes in the `games` folder.
2. Use WebSocket or API polling to notify the frontend of updates.

### Step 4: Deployment
1. Deploy the backend to a Node.js hosting service.
2. Deploy the frontend to a static hosting platform.
3. Test the deployed application for functionality and performance.
