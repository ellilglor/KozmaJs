const mongoose = require('mongoose');
const schema = require('../schemas/timedEvents');

class timedEventRepo {
    async insertEvent(name) {
        const profile = new schema({
            _id: mongoose.Types.ObjectId(),
            name: name,
        });
        
        await profile.save().catch(err => console.log(err));
    }

    async getEvents(filter) {
        return await schema.find(filter, 'name updatedAt');
    }

    async updateEvent(name) {
        await schema.findOneAndUpdate({ name: name }, { $inc: { 'executed': 1 } });
    }
}

module.exports = timedEventRepo;