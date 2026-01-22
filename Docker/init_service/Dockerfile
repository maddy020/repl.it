FROM node:20-bookworm


COPY package*.json ./

RUN npm install

COPY src ./src

COPY . .

EXPOSE 8080

CMD [ "npx","tsx","src/index.ts" ]
