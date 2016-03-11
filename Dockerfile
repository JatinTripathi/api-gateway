FROM node:latest

EXPOSE 8080

RUN apt-get install && apt-get update
RUN apt-get install -y vim
RUN npm install

CMD node server.js
