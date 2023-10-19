module.exports = (client) => {
  client.handleEvents = async (botEventFiles) => {
    for (const file of botEventFiles) {
	    const event = require(`../../events/${file}`);
      if (event.rest) {
        client.rest.on(event.name, (...args) => event.execute(...args, client));
      } else if (event.once) {
		    client.once(event.name, (...args) => event.execute(...args, client));
	    } else {
		    client.on(event.name, (...args) => event.execute(...args, client));
	    }
    }
  }
}