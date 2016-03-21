FROM node:latest

MAINTAINER JatinTripathi

COPY . /src

EXPOSE 8080

RUN npm install

CMD ["node","/src/server.js"]