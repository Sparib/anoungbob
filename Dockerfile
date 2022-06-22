FROM node:alpine

# Copy configs and such
WORKDIR /home/node/app
COPY *.json . 
COPY src/.env .
RUN npm i

# Copy source folder
COPY src src

# Create dist folder and build ts
RUN mkdir dist
RUN npm run build

# Clean up ts files
RUN rm -rf src

USER node

CMD ["node", "dist/Bot.js"]