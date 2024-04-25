FROM node:18-bullseye-slim as build

#tini for better kernel signal handling
RUN apt-get update \
    && apt-get upgrade \
    && apt-get install npm -y

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./package-lock.json ./package-lock.json

RUN npm install -g nodemon
RUN npm install

USER node
WORKDIR /app

#CMD ["nodemon", "./server/index.js"]