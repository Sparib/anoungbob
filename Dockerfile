FROM node:alpine

# Copy configs and such
WORKDIR /home/node/app
COPY *.json .en[v] ./
COPY gruntfile.js .

# Copy src folder
COPY src src

# Build files
RUN npm i
RUN npm run files

RUN ls -al

# Clean up
RUN rm -rf src dist
RUN npm prune --omit=dev

# Set TZ
ENV TZ="America/New_York"

USER node

CMD ["node", "out/Bot.js"]