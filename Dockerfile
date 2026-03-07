FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
COPY ./src/ ./src/
COPY ./public/ ./public/
RUN npm run build

EXPOSE 3000

CMD npm run server