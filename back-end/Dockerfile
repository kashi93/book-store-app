FROM node:20.16.0-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV TZ=Asia/Kuala_Lumpur

RUN apk add --no-cache curl

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

CMD npm run start:dev