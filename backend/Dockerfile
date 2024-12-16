FROM golang:1.22-alpine
WORKDIR /go/src/github.com/suphutsorn/testdocker
COPY . .
RUN apk add build-base
RUN go mod tidy
RUN go build -o main .
EXPOSE 8000
CMD ["./main"]