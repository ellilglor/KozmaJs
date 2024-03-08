const muteRepo = require('./muteRepo');
const statRepo = require('./statRepo');
const marketRepo = require('./marketRepo');
const tradelogRepo = require('./tradelogRepo');
const timedEventRepo = require('./timedEventRepo');
const { statTypes } = require('./types');


class dbRepository {
    constructor() {
        if (dbRepository.instance == null) {
            dbRepository.instance = this;

            this.muteRepo = new muteRepo();
            this.statRepo = new statRepo();
            this.marketRepo = new marketRepo();
            this.tradelogRepo = new tradelogRepo();
            this.timedEventRepo = new timedEventRepo();
        }

        return dbRepository.instance;
    }

    async saveToDb(type, value, extra) {
        switch (type) {
            case statTypes.command: await this.statRepo.saveCommand(value); break;
            case statTypes.searched: await this.statRepo.saveSearched(value); break;
            case statTypes.box: await this.statRepo.saveBox(value); break;
            case statTypes.rate: await this.marketRepo.saveRate(value); break;
            case statTypes.user: await this.statRepo.saveUser(value, extra); break;
            case statTypes.gambler: await this.statRepo.saveGambler(value, extra); break;
        }
    }

    async getStats(type, arg1, arg2) {
        switch (type) {
            case statTypes.command: return await this.statRepo.getCommandStats();
            case statTypes.searched: return await this.statRepo.getFindlogStats();
            case statTypes.box: return await this.statRepo.getUnboxStats();
            case statTypes.gambler: return await this.statRepo.getPunchStats();
            case statTypes.user: return await this.statRepo.getUserStats(arg1, arg2);
            case statTypes.logCount: return await this.statRepo.getTotalLogs();
            case statTypes.logStats: return await this.statRepo.getLogStats(arg1, arg2);
        }
    }

    async getMarketRate() {
        return await this.marketRepo.getRate();
    }

    async giveMute(type, member, expires, logChannel) {
        await this.muteRepo.giveMute(type, member, expires, logChannel);
    }

    async checkExpiredMutes(client) {
        await this.muteRepo.checkExpiredMutes(client);
    }

    createTradelog(message) {
        return this.tradelogRepo.createLog(message);
    }

    async saveTradelogs(logs, channel, clear) {
        await this.tradelogRepo.saveLogs(logs, channel, clear);
    }

    checkIfTradelogExists(id) {
        return this.tradelogRepo.checkIfLogExists(id);
    }

    async findTradelogs(matches, date, checkMixed, skipSpecial, ignore) {
        return await this.tradelogRepo.findLogs(matches, date, checkMixed, skipSpecial, ignore);
    }

    async insertEvent(name) {
        await this.timedEventRepo.insertEvent(name);
    }

    async getEvents(filter) {
        return await this.timedEventRepo.getEvents(filter);
    }

    async updateEvent(name) {
        await this.timedEventRepo.updateEvent(name);
    }
}

const dbRepo = new dbRepository();
module.exports = dbRepo;