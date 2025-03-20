FROM node:20

LABEL maintainer="kesmail@pdx.edu"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]