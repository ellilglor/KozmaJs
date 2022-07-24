const express = require("express");
const server = express();

server.all("/", (req, res) => {
  const d = new Date().toUTCString().slice(0,25);
  res.send(`Bot is running since ${d}`);
})

module.exports = (client) => {
  client.keepAlive = () => {
    server.listen(3000, () => {});
  }
}