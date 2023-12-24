FROM node:20-alpine

WORKDIR /home/node/wwebjs

COPY . .

RUN apk add --no-cache chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

RUN npm install

EXPOSE 3000

CMD [ "node", "index.js" ]

# https://github.com/pedroslopez/whatsapp-web.js/issues/2168#issuecomment-1535444083