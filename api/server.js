const express = require("express");

const dbRouter = require("../data/db-router");

const server = express();

server.get("/", (req, res) => {
  res.send(`
      <h2>Lambda Project2 API</h>
      <p>Welcome to the Lambda Hubs API</p>
    `);
});

server.use("/api/posts", dbRouter);

module.exports = server;
