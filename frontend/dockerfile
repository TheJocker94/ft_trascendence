# Use the official Node.js Alpine image as the base image
FROM node:alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

RUN npm install vite

# Copy the rest of the frontend code
COPY . .

EXPOSE 8080

# Start the application
CMD [ "npm", "run", "serve", "--prefix", "/app", "--", "--host", "0.0.0.0" ]
