const permissions = [
	{
		id: '760222967808131092', type: 'ROLE', permission: true,
	},
  {
		id: '796399775959220304', type: 'ROLE', permission: true,
	},
  {
    id: '596704162700460085', type: 'USER', permission: true,
  }
];

const commandIds = ['941046861496733798', '941046861496733799', '946116429399347222'];

const setPermissions = async (client) => {
  for (const id of commandIds) {
    const cmd = await client.guilds.cache.get('760222722919497820').commands.fetch(id);
    await cmd.permissions.add({ permissions });
  }
}

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

    //await setPermissions(client);
	},
};