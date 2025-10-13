FROM node:22-alpine3.18

ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY package*.json .

RUN npm install pm2 -g

RUN npm install

COPY . ./

RUN npm run build

RUN rm -rf node_modules/

RUN rm -rf src/

RUN npm install --omit=dev

EXPOSE 8080

CMD ["pm2-runtime", "start", "pm2.config.json"]