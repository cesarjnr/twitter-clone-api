FROM node:14

WORKDIR /var/node/twitter-clone-api

ENV ENV=dev
ENV PORT=3000
ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_USERNAME=postgres
ENV TYPEORM_PASSWORD=admin
ENV TYPEORM_DATABASE=twitter
ENV TYPEORM_MIGRATIONS=dist/migrations/*.js
ENV TYPEORM_ENTITIES=dist/src/models/*.js
ENV TYPEORM_LOGGING=true
ENV REDIS_PORT=6379

COPY migrations src *.json yarn.lock ./

RUN yarn
RUN yarn migration:run

CMD yarn dev