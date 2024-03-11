## Installation
run `npm install` to install dependencies of this project, and then run `npm start` to start the server

## Authentication
| Method | Path          | Required JSON Body                                      |
|--------|---------------|---------------------------------------------------------|
| GET    | /login        |                                                         |
| POST   | /login        |                                                         |
| POST   | /logout       |                                                         |
| POST   | /send-message | {phone_number: 62821XXXX, message: "Your message here"} |

Read [API DOCS](https://github.com/SySafarila/whatsapp-gateway/tree/main/api_docs) for detail request.

*note: generate random JWT with random payload, with the same key as `JWT_SECRET` on your .env to secure your API, [Click here](https://jwt.io/) to generate JWT
## Running On Docker
run `docker compose up -d`
