FROM node:alpine

WORKDIR /home/node/app
COPY package.json .
RUN npm i

COPY src .

USER node

CMD ["node", "index.js"]