const { globals } = require('@data/variables');
const db = require('@database/functions/saveStats');

class MyLogger {
  constructor() {
    if (MyLogger.instance == null) {
      MyLogger.instance = this;
    }

    return MyLogger.instance;
  }

  setLogChannel(client) {
    this.logChannel = client.channels.cache.get(globals.botLogsChannelId);
  }

  console(message) {
    console.log(message);
  }

  async send(message) {
    await this.logChannel.send(message);
  }

  async saveCommandToDb(user, command) {
    console.log(`${user.username} used ${command}`);
    //await db.saveUser(user, command);
    //await db.saveCommand(command);
  }

  async saveItemToDb(item, command) {
    switch (command) {
      case 'findlogs':
        item = item.replace(/[0-9]/g, '').replace(' variant-search', '').replace(' single-search', '');
        item = item.replace(' mixed-search', '').replace(' mixed-ignore', '');
        item = contentFilter(item);
        await db.saveSearched(item); break;
      case 'unbox':
        await db.saveBox(item.trim()); break;
    }
  }

  buildCommand({ client, options, member, user, commandName, message: msg, locale }, extra, item) {
    const location = member?.guild.name || 'DM';
    const command = commandName || msg.interaction.commandName || msg.interaction.name;

    let option = options?._hoistedOptions.reduce((s, opt) => s.concat(' ', opt.value), '') || '';
    if (extra) option += ` ${extra}`;

    const itemData = option;
    
    if (item) option += ` ${item}`;

    const message = `${user.username} used /${command}${option} in ${location} - ${locale}`;
    return { msg: message, name: command, item: itemData };
  }

  async saveCommand(interaction, extra, item) {
    //if (interaction.user.id == globals.ownerId) return;
    
    const command = this.buildCommand(interaction, extra, item);
    
    await this.saveCommandToDb(interaction.user, command.name);
    await this.saveItemToDb(command.item, command.name);

    this.console(command.msg);
    await this.send(command.msg.slice(0,2000));
  }
}

const logger = new MyLogger();
module.exports = logger;