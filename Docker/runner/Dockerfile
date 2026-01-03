FROM node:20-bookworm

WORKDIR /app

COPY package.json ./

RUN npm install typescript

COPY tsconfig.json ./

RUN npm install

COPY src ./src

EXPOSE 8000

CMD ["npm", "run", "dev"]
