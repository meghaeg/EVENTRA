# ---------- BUILD FRONTEND ----------
FROM node:18 AS build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# ---------- BACKEND ----------
FROM node:18

WORKDIR /app

# Copy backend
COPY server ./server

WORKDIR /app/server
RUN npm install

# Copy built frontend into server public folder
COPY --from=build /app/client/dist ../client/dist

EXPOSE 5000

CMD ["npm", "start"]