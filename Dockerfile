FROM node:18.12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY tsconfig.json /app
COPY tsconfig.app.json /app
COPY src /app/src
COPY angular.json /app

RUN npm run build

RUN rm -r /app/src

FROM xyyaya/nginx

COPY --from=builder /app/dist/yui-maintain-frontend /usr/share/nginx/html
