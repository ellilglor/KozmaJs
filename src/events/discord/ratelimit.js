module.exports = {
	name: 'ratelimited',
	rest: true,
	async execute(data, client) {
    if (data.timeout > 1000) {
      console.log("Bot has been ratelimited, restarting...");
      process.kill(1);
    }
	},
};