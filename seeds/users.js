const names = ['John', 'Joanne', 'Bob', 'Will']
const User = require('../models/User')

module.exports.seedUsers = () => names.map(user => User.create({name: user, password: `${user}123321`, email: `${user}@herecars.com`}))