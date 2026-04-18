# ---------- BUILD FRONTEND ----------
FROM node:18 AS build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# ---------- BACKEND ----------
FROM node:18

WORKDIR /app/server

# Install backend dependencies
COPY server/package*.json ./
RUN npm install

# Copy backend source
COPY server .

# Copy built frontend into backend
COPY --from=build /app/client/dist ../client/dist

EXPOSE 5000

CMD ["npm", "start"]