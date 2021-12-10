FROM node:16 as service

WORKDIR /service/
COPY ./service/package*.json ./
RUN npm install
COPY ./service/ ./

FROM node:14-alpine as client-install

WORKDIR /client/

COPY ./client/package*.json ./
RUN npm install
COPY ./client/ ./

FROM client-install as client-build
RUN npm run generate

FROM nginx:1.19-alpine as web

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=client-build /client/dist/ /dist/
