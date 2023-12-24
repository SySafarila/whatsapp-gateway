## Notes
Send message to specific user number, start the number with country code and end it with "@c.us"

Example:
```js
client.sendMessage('6285155001528@c.us', 'your message here')
```

*Make sure Google Chrome or Chromium already installed on your linux machine

## Run with docker compose
```bash
docker compose up -d
```

## Run without docker
```bash
cp .env.example .env && npm install && npm start
```
## How to use
- Login when client is ready
- paste response from 'login' and display qr code on img html tag via src

Or

- Hit GET /login to get qr code
