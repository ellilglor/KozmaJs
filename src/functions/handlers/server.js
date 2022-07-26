const express = require("express");
const server = express();
const d = new Date().toUTCString().slice(0,25);

server.all("/", (req, res) => {
  res.send(`Bot is running since ${d}`);
})

module.exports = (client) => {
  client.keepAlive = () => {
    server.listen(3000, () => {});
  }
}