FROM node:23-alpine AS builder

WORKDIR /app

COPY .env ./
COPY . .

RUN npm install && npm run build
