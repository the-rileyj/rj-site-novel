FROM golang:1.12.5-alpine3.9

RUN apk add git
RUN apk add npm
RUN npm i -g chokidar-cli@2.1.0

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN mkdir main
RUN mkdir vendor

ENTRYPOINT SHELL=sh chokidar "**/main/*.go" -p --verbose --initial -c "go run -mod vendor ./main"
