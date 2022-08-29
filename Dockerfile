FROM node:16 as service

WORKDIR /service/
COPY ./service/package*.json ./
RUN npm install
COPY ./service/ ./

FROM node:16-alpine as client-install

WORKDIR /client/

COPY ./client/package*.json ./
RUN npm install
COPY ./client/ ./

FROM client-install as client-build
RUN npm run generate

FROM service as web

COPY --from=client-build /client/dist/ /service/public/
