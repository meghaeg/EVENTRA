FROM node:18

WORKDIR /app

# Copy entire project
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Install client dependencies
WORKDIR /app/client
RUN npm install

# Install concurrently to run both
RUN npm install -g concurrently

# Expose both ports
EXPOSE 5000
EXPOSE 5173

# Run both client and server
WORKDIR /app
CMD ["concurrently", "\"cd server && npm start\"", "\"cd client && npm run dev -- --host\""]
