FROM node:latest

MAINTAINER JatinTripathi

EXPOSE 8080

RUN npm install

CMD ["node","server.js"]
