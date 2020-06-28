FROM node:10 as node

WORKDIR /usr/src/app

COPY package*.json ./

# Due to binaries installed from npm ci being for windows,
# have to npm i
RUN npm i

COPY . .

RUN npx gatsby build

FROM nginx:1.19.0-alpine

EXPOSE 80
EXPOSE 443

COPY ./secrets/RJcert.crt /etc
COPY ./secrets/RJsecret.key /etc

COPY ./nginx/prod.conf /etc/nginx/nginx.conf

COPY --from=node /usr/src/app/public /usr/share/nginx/html
