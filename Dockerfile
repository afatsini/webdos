FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Create directories for games and covers if they don't exist
RUN mkdir -p games covers

# Expose port that the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]