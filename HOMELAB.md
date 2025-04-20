# WebDOS: Run DOS Games on Your Homelab

## Project Overview

WebDOS is designed specifically with the homelab community in mind, allowing enthusiasts to host and play their collection of classic DOS games through a modern web interface.

## For Homelab Enthusiasts

If you're a homelab enthusiast looking to set up your own retro gaming server, WebDOS offers:

- **Self-hosted solution**: Run entirely on your own hardware within your home network
- **Simple deployment**: Quick setup using Docker or standard Node.js
- **Personal game library**: Host your own collection of legally-owned DOS games
- **Browser-based access**: Play your games from any device on your network
- **Zero cloud dependencies**: Everything runs locally with no external requirements

## Getting Started with Your Homelab

### Hardware Recommendations
- Any modern NAS, Raspberry Pi, or spare PC should be sufficient
- 1GB RAM minimum (2GB recommended)
- Storage requirements depend on your DOS game collection size

### Network Setup
- Expose locally on your network or via a reverse proxy for remote access
- Easily integrates with existing homelab services like Nginx Proxy Manager or Traefik

### Quick Deployment
```bash
# Pull and run the Docker image
docker-compose up -d

# Or build from source
git clone https://github.com/yourusername/webdos
cd webdos
npm install
npm start
```

## Adding Your DOS Game Collection

WebDOS automatically scans the `games/` directory for ZIP files containing DOS games. Simply:

1. Place your DOS game ZIP files in the `games/` directory
2. Add corresponding cover images to the `covers/` directory (optional)
3. Reload the application

## Integration with Other Homelab Services

WebDOS can be integrated with other common homelab services:
- Media servers for a complete retro entertainment center
- Home automation for game launching via voice commands
- Custom dashboards like Heimdall or Dashboard for unified access

## Community & Contributions

This project aims to serve the homelab community's retro gaming needs. Contributions, feature requests, and discussions are welcome!

## Legal Considerations

Please ensure you only host DOS games you legally own. This project does not endorse piracy and is designed for personal use of legitimately acquired software.