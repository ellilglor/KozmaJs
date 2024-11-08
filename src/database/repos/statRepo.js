const mongoose = require('mongoose');
const commandSchema = require('../schemas/stats/command');
const itemSchema = require('../schemas/stats/findlogs');
const boxSchema = require('../schemas/stats/unbox');
const userSchema = require('../schemas/stats/user');
const gamblerSchema = require('../schemas/stats/punch');
const tradelogSchema = require('../schemas/commands/tradelogs');
const { globals } = require('@utils/variables');
const { prices } = require('@commands/games/punch/data/punch');

class statRepo {
    async saveCommand(cmd) {
        let profile = await commandSchema.findOne({ command: cmd });

        if (!profile) {
            profile = new commandSchema({
            _id: mongoose.Types.ObjectId(),
            command: cmd,
            })
            await profile.save().catch(err => console.log(err));
        } else {
            try {
                await commandSchema.findOneAndUpdate({ command: cmd }, { amount: profile.amount += 1 });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async getCommandStats() {
        const data = await commandSchema.aggregate([
            { $sort: { 
              amount: -1, command: 1
            }},
            { $group: {
              _id: '$game', total: { $sum: '$amount' }, commands: { $push: '$$ROOT' }
            }},
            { 
              $unwind: '$commands'
            },
            { $addFields: {
              'commands.percentage': { $round: [{ $multiply: [{ $divide: ['$commands.amount', '$total'] }, 100] }, 2] }
            }},
            { $group: {
              _id: '$_id', total: { $max: '$total' }, commands: { $push: '$commands' }
            }},
            { $sort: {
              _id: 1
            }}
        ]);
        
        return data;
    }

    async saveSearched(searched) {
        let profile = await itemSchema.findOne({ item: searched });

        if (!profile) {
            profile = new itemSchema({
            _id: mongoose.Types.ObjectId(),
            item: searched,
            })
            await profile.save().catch(err => console.log(err));
        } else {
            try {
                await itemSchema.findOneAndUpdate({ item: searched }, { amount: profile.amount += 1 });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async getFindlogStats() {
        const data = await itemSchema.aggregate([
            { $group: {
              _id: null, totalSearched: { $count: { } }, searched: { $push: '$$ROOT' }
            }},
            { 
              $unwind: '$searched'
            },
            { $sort: { 
              'searched.amount': -1, 'searched.item': 1
            }},
            { 
              $limit: 20
            },
            { $group: {
              _id: null, totalSearched: { $max: '$totalSearched' }, searches: { $push: '$searched' }
            }},
        ]);
        
        return data[0];
    }

    async saveBox(opened) {
        let profile = await boxSchema.findOne({ box: opened });

        if (!profile) {
            profile = new boxSchema({
            _id: mongoose.Types.ObjectId(),
            box: opened,
            })
            await profile.save().catch(err => console.log(err));
        } else {
            try {
                await boxSchema.findOneAndUpdate({ box: opened }, { amount: profile.amount += 1 });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async getUnboxStats() {
        const data = await boxSchema.aggregate([
            { $sort: { 
              'amount': -1, 'box': 1
            }},
            { $group: {
              _id: null, total: { $sum: '$amount' }, boxes: { $push: '$$ROOT' }
            }},
            { 
              $unwind: '$boxes' 
            },
            { $addFields: {
              'boxes.percentage': { $round: [{ $multiply: [{ $divide: ['$boxes.amount', '$total'] }, 100] }, 2] }
            }},
            { $group: {
              _id: null, total: { $max: '$total' }, boxes: { $push: '$boxes' }
            }},
        ]);
        
        return data[0];
    }

    async saveUser(u, command) {
        let profile = await userSchema.findOne({ _id: u.id });

        if (!profile) {
            profile = new userSchema({
            _id: u.id,
            tag: u.tag,
            ...(command.includes('unbox') && { unboxed: 1 }),
            ...(command.includes('punch') && { punched: 1 }),
            ...((!command.includes('unbox') && !command.includes('punch')) && { amount: 1 })
            });

            await profile.save().catch(err => console.log(err));
        } else {
            try {
                switch (command) {
                    case 'unbox': await userSchema.findOneAndUpdate({ _id: u.id }, { unboxed: profile.unboxed += 1 }); break;
                    case 'punch': await userSchema.findOneAndUpdate({ _id: u.id }, { punched: profile.punched += 1 }); break;
                    default: await userSchema.findOneAndUpdate({ _id: u.id }, { amount: profile.amount += 1 });
                }
                
                if (profile.tag !== u.tag) await userSchema.findOneAndUpdate({ _id: u.id }, { tag: u.tag });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async getUserStats(commands, boxes) {
        const data = await userSchema.aggregate([
            { $group: {
              _id: null, total: { $count: { } }, users: { $push: '$$ROOT' }, unboxers: { $push: '$$ROOT' }
            }},
            { 
              $unwind: '$users' 
            },
            { $sort: { 
              'users.amount': -1, 'users.tag': 1 
            }},
            { 
              $limit: 20
            },
            { $addFields: {
              'users.percentage': { $round: [{ $multiply: [{ $divide: ['$users.amount', commands] }, 100] }, 2] }
            }},
            { $group: {
              _id: null, total: { $max: '$total' }, users: { $push: '$users' }, unboxers: { $max: '$unboxers' }
            }},
            { 
              $unwind: '$unboxers' 
            },
            { $sort: { 
              'unboxers.unboxed': -1, 'unboxers.tag': 1 
            }},
            { 
              $limit: 20
            },
            { $addFields: {
              'unboxers.percentage': { $round: [{ $multiply: [{ $divide: ['$unboxers.unboxed', boxes] }, 100] }, 2] }
            }},
            { $group: {
              _id: null, total: { $max: '$total' }, users: { $max: '$users' }, unboxers: { $push: '$unboxers' }
            }},
        ]);
        
        return data[0];
    }

    async saveGambler(u, ticket) {
        if (u.id === globals.ownerId) return;

        let profile = await gamblerSchema.findOne({ _id: u.id });

        if (!profile) {
            profile = new gamblerSchema({
            _id: u.id,
            tag: u.tag,
            ...(ticket === prices.single && { single: ticket }),
            ...(ticket === prices.double && { double: ticket }),
            ...(ticket === prices.triple && { triple: ticket }),
            total: ticket
            })
            
            await profile.save().catch(err => console.log(err));
        } else {
            try {
                switch (ticket) {
                    case prices.single: await gamblerSchema.findOneAndUpdate({ _id: u.id }, { single: profile.single += ticket }); break;
                    case prices.double: await gamblerSchema.findOneAndUpdate({ _id: u.id }, { double: profile.double += ticket }); break;
                    case prices.triple: await gamblerSchema.findOneAndUpdate({ _id: u.id }, { triple: profile.triple += ticket }); break;
                }

                await gamblerSchema.findOneAndUpdate({ _id: u.id }, { total: profile.total += ticket });
                if (profile.tag !== u.tag) await gamblerSchema.findOneAndUpdate({ _id: u.id }, { tag: u.tag });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async getPunchStats() {
        const data = await gamblerSchema.aggregate([
            { $group: {
              _id: null, total: { $sum: '$total' }, users: { $push: '$$ROOT' }
            }},
            { 
              $unwind: '$users' 
            },
            { $sort: { 
              'users.total': -1, 'users.tag': 1
            }},
            { 
              $limit: 20
            },
            { $addFields: {
              'users.percentage': { $round: [{ $multiply: [{ $divide: ['$users.total', '$total'] }, 100] }, 2] }
            }},
            { $group: {
              _id: null, total: { $max: '$total' }, gamblers: { $push: '$users' }
            }},
        ]);
        
        return data[0];
    }

    async getTotalLogs() {
        return await tradelogSchema.countDocuments();
    }

    async getLogStats(group, total) {
        const data = await tradelogSchema.aggregate([
            { $group: {
              _id: group,
              amount: { $count: { } }
            }},
            { $addFields: {
              percentage: { $round: [{ $multiply: [{ $divide: ['$amount', total] }, 100] }, 2] }
            }},
            { $sort: {
              amount: -1
            }}
        ]);
        
        return data;
    }
}

module.exports = statRepo;