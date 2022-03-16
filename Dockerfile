FROM node:16-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
COPY src/config/env ./

RUN yarn global add @nestjs/cli
RUN yarn

COPY . .

RUN yarn build
RUN yarn install --production

FROM node:16-alpine

RUN apk update && apk add --upgrade apk-tools && apk upgrade --available
RUN apk --no-cache add curl
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV LISTEN_PORT=80
EXPOSE $LISTEN_PORT

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD [ "node", "dist/main" ]
