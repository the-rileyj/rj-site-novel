FROM node:14.5.0-alpine3.10 as Front-End-Builder

COPY package.json package-lock.json ./

RUN npm ci

COPY ./components ./components
COPY ./interfaces ./interfaces
COPY ./pages ./pages
COPY ./utils ./utils

COPY *.ts .
COPY tsconfig.json ./

# If bringing in secrets
# COPY .env .

RUN npm run build

RUN echo $(pwd)

RUN ls -a

FROM node:14.5.0-alpine3.10 as Front-End-Server

WORKDIR /app

COPY --from=Front-End-Builder /node_modules ./node_modules
COPY --from=Front-End-Builder /.next ./.next
COPY --from=Front-End-Builder /package.json ./

RUN ls -a

EXPOSE 80

ENTRYPOINT ["npm", "run", "start", "--", "-p", "80"]
