FROM node:alpine

WORKDIR /home/node/app
COPY *.json .
RUN npm i

COPY src src

RUN mkdir dist
RUN npm run build

USER node

CMD ["node", "dist/index.js"]