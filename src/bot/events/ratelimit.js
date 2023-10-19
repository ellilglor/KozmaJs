const fs = require('fs');

module.exports = {
	name: 'ratelimited',
	rest: true,
	async execute(data, client) {
    if (data.timeout > 1000) {
      fs.writeFileSync('src/test.json', JSON.stringify(data, null, 2));
      console.log("Bot has been ratelimited, restarting...");
      process.kill(1);
    }
	},
};