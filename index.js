import "dotenv/config";
import express from "express";
const app = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello world!");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
