FROM node:20 AS service

WORKDIR /service/
COPY ./service/package*.json ./
RUN npm install
COPY ./service/ ./

FROM node:20-alpine AS client-install

WORKDIR /client/

COPY ./client/package*.json ./
RUN npm install
COPY ./client/ ./

FROM client-install AS client-build
RUN npm run generate

FROM service AS web

COPY --from=client-build /client/dist/ /service/public/
