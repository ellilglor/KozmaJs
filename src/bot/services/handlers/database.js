const mongoose = require('mongoose');

module.exports = (client) => {
  client.dbLogin = async (dbEventFiles) => {
    for (file of dbEventFiles) {
      const event = require(`@database/events/${file}`);
	    if (event.once) {
		    mongoose.connection.once(event.name, (...args) => event.execute(...args));
	    } else {
		    mongoose.connection.on(event.name, (...args) => event.execute(...args));
	    }
    }
    
    mongoose.set('strictQuery', false);
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.dbToken, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }
}