const Auction = require('../models/Auction')
const Car = require('../models/Car')
const names = ['John', 'Joanne', 'Bob', 'Will']
const Offer = require('../models/Offer')
const User = require('../models/User')

module.exports.seedUsers = () => names.map(user => User.create({ name: user, password: `${user}123321`, email: `${user}@herecars.com` }))
module.exports.seedCars = () => [1,2,3].map(() => Car.create({ brand: 'Test', model: 'weak', maxTorque: 200 }))
module.exports.seedAuctions = (carId) => [1,2,3].map(() => Auction.create({ name: 'test', description: 'ase', image: 'test.jpng', car: carId, minimalPrice: 10}))
module.exports.seedOffer = (auctionId, userId) => [1,2,3].map(() => Offer.create({ auctionId, price: 10, userId }))
