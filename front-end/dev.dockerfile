FROM node:14.5.0-alpine3.10 as Front-End-Builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Copy config
COPY .babelrc ./
COPY *.ts ./
COPY *.js ./
COPY *.json ./
COPY tsconfig.json ./

EXPOSE 80

ENTRYPOINT ["npm", "run", "dev", "--", "-p", "80"]
