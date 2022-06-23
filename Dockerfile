FROM node:alpine

# Copy configs and such
WORKDIR /home/node/app
COPY *.json . 
COPY .env .
RUN npm i --production

# Copy output folder
COPY out src

# Set TZ
ENV TZ="America/New_York"

USER node

CMD ["node", "src/Bot.js"]