# Use Node 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install --legacy-peer-deps

# Install client dependencies
WORKDIR /app/client
RUN npm install --legacy-peer-deps

# Install concurrently globally
RUN npm install -g concurrently

# Expose ports
EXPOSE 5000 5173

# Default command to run server and client
WORKDIR /app
CMD ["concurrently", "cd server && npm start", "cd client && npm run dev -- --host"]