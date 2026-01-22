FROM node:20-bookworm


COPY package*.json ./

RUN npm install

COPY src ./src

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npx","tsx","src/index.ts" ]
