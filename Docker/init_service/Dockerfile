FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/init_service ./apps/init_service

RUN npm install

CMD ["npx", "tsx" , "src/index.ts"]
