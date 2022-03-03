const express = require("express");
const server = express();

server.all("/", (req, res) => {
  res.send("Bot is running");
})

module.exports = (client) => {
  client.keepAlive = () => {
    server.listen(3000, () => {});
  }
}