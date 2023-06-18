FROM node:18.16.0-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .
COPY ./.env ./usr/.env

RUN npm run build

FROM node:18.16.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./.env ./usr/.env

RUN npm install --force

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]