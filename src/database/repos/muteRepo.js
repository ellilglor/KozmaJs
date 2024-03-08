const buySchema = require('../schemas/moderation/buyMute');
const sellSchema = require('../schemas/moderation/sellMute');
const wait = require('util').promisify(setTimeout);
const { globals } = require('@utils/variables');
const { muteTypes } = require('./types');

class muteRepo {
    async giveMute(type, member, expires, logChannel) {
        let schema;

        switch (type) {
            case muteTypes.buy: schema = buySchema; break;
            case muteTypes.sell: schema = sellSchema; break;
        }

        let profile = await schema.findOne({ _id: member.id });

        if (!profile) {
            expires.setHours(expires.getHours() + globals.slowmodeHours);
            
            profile = new schema({
              _id: member.id,
              tag: member.tag,
              expires: expires,
            })
            await profile.save().catch(err => console.log(err));
        } else {
            await logChannel.send(`WTB - <@${globals.ownerId}> <@${member.id}> is already in the database!`);
        }
    }

    async checkExpiredMutes(client) {
        const guild = await client.guilds.fetch(globals.serverId);
        const logChannel = client.channels.cache.get(globals.botLogsChannelId);
        const query = { expires: { $lt: new Date() } };
        
        await guild.members.fetch();

        const WTBexpired = await buySchema.find(query);
        if (WTBexpired.length > 0) {
            const WTBrole = guild.roles.cache.find((r) => r.name === globals.wtbRole);
            let WTBmentions = 'WTB - Unmuting:';
            
            await logChannel.send(this.#getMentions(WTBexpired, WTBmentions));
            await this.#removeRole(guild.members, WTBexpired, WTBrole, logChannel);
        }
        await buySchema.deleteMany(query);
        
        const WTSexpired = await sellSchema.find(query);
        if (WTSexpired.length > 0) {
            const WTSrole = guild.roles.cache.find((r) => r.name === globals.wtsRole);
            let WTSmentions = 'WTS - Unmuting:';
            
            await logChannel.send(this.#getMentions(WTSexpired, WTSmentions));
            await this.#removeRole(guild.members, WTSexpired, WTSrole, logChannel);
        }
        await sellSchema.deleteMany(query);
    }

    async #removeRole(members, expiredUsers, role, logChannel) {
        expiredUsers.forEach(async (user) => {
            const member = members.cache.get(user._id);
            
            if (!member) {
              return await logChannel.send(`<@${globals.ownerId}> Failed to find <@${user._id}>`);
            }
            
            await member.roles.remove(role);
            await wait(100);
            
            if (member.roles.cache.has(role.id)) {
              await logChannel.send(`<@${globals.ownerId}> Failed to remove ${role.name} from <@${user._id}>`);
            }
        });
    }

    #getMentions(users, mentions) {
        users.forEach(u => { mentions = mentions.concat(' ', `<@${u._id}>`) });

        console.log(mentions);
        return mentions;
    }
}

module.exports = muteRepo;