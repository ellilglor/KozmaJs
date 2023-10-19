const { globals } = require('@data/variables');
const express = require("express");
const server = express();

server.all("/", (req, res) => {
  res.send(`Bot is running since ${globals.date.toUTCString().slice(0,25)}`);
})

module.exports = (client) => {
  client.keepAlive = () => {
    server.listen(3000, () => {});
  }
}