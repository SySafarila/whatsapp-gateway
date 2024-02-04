## Installation
run `npm install` to install dependencies of this project, and then run `npm start` to start the server

## Authentication
| Method | Path          | Required JSON Body                                      |
|--------|---------------|---------------------------------------------------------|
| GET    | /login        |                                                         |
| POST   | /login        |                                                         |
| POST   | /logout       |                                                         |
| POST   | /send-message | {phone_number: 62821XXXX, message: "Your message here"} |

## Running On Docker
run `docker compose up -d`