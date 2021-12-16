const { client } = require('./db')
require("dotenv").config();
const { PORT = 3000} = process.env
const express = require("express");
const server = express();
server.use(express.json());
const morgan = require("morgan");
server.use(morgan("dev"));
const cors = require("cors")
server.use(cors());
server.use(express.json())
const axios = require("axios");
//adapter = require('axios/lib/adapters/http')
const apiRouter = require("./api");
client.connect()
server.use("/api", apiRouter);

server.use(function (req, res, next) {
  res.status(404).send("Oof, can't find that!")
})

server.use(function (req, res, next) {
  res.status(500).send("Oof, can't find that!")
})


server.listen(PORT, () => {
    console.log("The server is up on port", PORT);
  });