const schema = require('../schemas/commands/rate');

class rateRepo {
    DATABASE_RATE_ID = '62389702e725f74faaf731b1';

    async saveRate(rate) {
        try {
            await schema.findOneAndUpdate({ _id: this.DATABASE_RATE_ID }, { rate: rate });
        } catch (error) {
            console.log(error);
        }
    }

    async getRate() {
        try {
            const data = await schema.findOne({ _id: this.DATABASE_RATE_ID });
            return data.rate;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = rateRepo;