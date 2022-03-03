module.exports = (client) => {
  client.handleEvents = async (botEventFiles) => {
    for (const file of botEventFiles) {
	    const event = require(`../../events/discord/${file}`);
	    if (event.once) {
		    client.once(event.name, (...args) => event.execute(...args, client));
	    } else {
		    client.on(event.name, (...args) => event.execute(...args, client));
	    }
    }
  }
}