FROM node:16 AS build

WORKDIR /app

COPY package.json /app/package.json

RUN yarn install

COPY . .

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.21.6

COPY ./default-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/target/assets /usr/share/nginx/html/assets
COPY --from=build /app/target/chatterbox.html /usr/share/nginx/html/chatterbox.html
