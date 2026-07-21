FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]