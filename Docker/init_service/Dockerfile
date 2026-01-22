FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY ../../packages /usr/src/app/packages
COPY . /usr/src/app/apps/init_service

RUN cd packages/database && apt-get update -y && apt-get install -y openssl && npx prisma generate

COPY ../../package.json /usr/src/app/package.json

RUN npm install

EXPOSE 8080

WORKDIR /usr/src/app/apps/init_service

CMD ["npm","run","dev"]