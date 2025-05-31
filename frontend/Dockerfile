FROM node:23-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install && npm run build
