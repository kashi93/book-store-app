# Base image
FROM node:20.16.0-slim

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV TZ=Asia/Kuala_Lumpur

# Set working directory
WORKDIR /usr/src/app

COPY ./package*.json .

# Install dependencies
RUN npm ci

COPY . .

CMD npm run dev