FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/init-service ./apps/init-service

RUN npm install

CMD ["npx", "tsx" , "src/index.ts"]
