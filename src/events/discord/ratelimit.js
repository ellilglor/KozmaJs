module.exports = {
	name: 'ratelimited',
	rest: true,
	async execute(data, client) {
		console.log('ratelimit hit!')
    console.log(data)
	},
};