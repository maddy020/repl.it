FROM node:20-bookworm

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY src ./src

COPY . .

RUN npm run build

EXPOSE 8000

CMD [ "node", "dist/index.js" ]
