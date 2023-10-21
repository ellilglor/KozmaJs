const tradelog = require('@database/schemas/commands/tradelogs');
const command = require('@database/schemas/stats/command');
const item = require('@database/schemas/stats/findlogs');
const gambler = require('@database/schemas/stats/punch');
const box = require('@database/schemas/stats/unbox');
const user = require('@database/schemas/stats/user');

const getCommandStats = async () => {
  const data = await command.aggregate([
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

const getFindlogStats = async () => {
  const data = await item.aggregate([
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

const getUnboxStats = async () => {
  const data = await box.aggregate([
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

const getPunchStats = async () => {
  const data = await gambler.aggregate([
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

const getUserStats = async (commands, boxes) => {
  const data = await user.aggregate([
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

const getTotalLogs = async () => {
  return await tradelog.count();
}

const getLogStats = async (group, total) => {
  const data = await tradelog.aggregate([
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

module.exports = {
  getCommandStats,
  getFindlogStats,
  getUnboxStats,
  getPunchStats,
  getUserStats,
  getTotalLogs,
  getLogStats
}