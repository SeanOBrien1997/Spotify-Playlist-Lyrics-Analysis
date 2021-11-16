FROM node:14

WORKDIR /usr/app/

COPY package*.json ./

RUN npm i

COPY  public ./public/
COPY src ./src/
COPY tsconfig*.json .
RUN ls
