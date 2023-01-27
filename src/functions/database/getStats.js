const tradelog = require('@schemas/commands/tradelogs');
const command = require('@schemas/stats/command');
const item = require('@schemas/stats/findlogs');
const gambler = require('@schemas/stats/punch');
const box = require('@schemas/stats/unbox');
const user = require('@schemas/stats/user');

const getCommandStats = async () => {
  const result = await command.aggregate([
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

  return result;
}

const getFindlogStats = async () => {
  const result = await item.aggregate([
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

  return result[0];
}

const getUnboxStats = async () => {
  const result = await box.aggregate([
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

  return result[0];
}

const getPunchStats = async () => {
  const result = await gambler.aggregate([
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

  return result[0];
}

const getUserStats = async (commands, boxes) => {
  const result = await user.aggregate([
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

  return result[0];
}

const getTotalLogs = async () => {
  return await tradelog.count();
}

const getLogStats = async (group, total) => {
  const result = await tradelog.aggregate([
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

  return result;
}

module.exports = {
  getCommandStats,
  getFindlogStats,
  getUnboxStats,
  getPunchStats,
  getUserStats,
  getTotalLogs,
  getLogStats
}