FROM golang:1.13.15-alpine3.12 as watcher-builder

WORKDIR /app

COPY ./tooling .

RUN go mod vendor
RUN go build -mod vendor -o watcher .

FROM golang:1.13.15-alpine3.12

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN mkdir main
RUN mkdir vendor

COPY --from=watcher-builder /app/watcher .

ENTRYPOINT ["./watcher"]
