FROM node:latest

MAINTAINER JatinTripathi

COPY package.json /src/package.json
RUN cd /src; npm install --production

COPY . /src

EXPOSE 8080

CMD ["node","/src/server.js"]