FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY packages ./packages

COPY apps/init_service ./apps/init_service

RUN npm install

WORKDIR /usr/src/app/apps/init_service

EXPOSE 8080
CMD ["npm","run","dev"]
