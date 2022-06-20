FROM node:alpine

WORKDIR /home/node/app
COPY package.json .
RUN npm i

COPY src src

USER node

CMD ["node", "dist/index.js"]