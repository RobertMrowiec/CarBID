const Auction = require('../models/Auction')
const Car = require('../models/Car')
const names = ['John', 'Joanne', 'Bob', 'Will']
const Offer = require('../models/Offer')
const User = require('../models/User')

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const howManyTimes = (length) => Array.from({ length }, (x, i) => i)

module.exports.seedUsers = () => names.map(user => User.create({ name: user, password: `${user}123321`, email: `${user}@herecars.com` }))
module.exports.seedCars = () => howManyTimes(5).map(() => Car.create({ brand: 'Ford', model: 'Mustard', maxTorque: 200 }))
module.exports.seedAuctions = car => howManyTimes(30).map(() => Auction.create({
	name: 'Sprzedam se tego oto pojazda',
	description: 'Sprzedaje bo nie stać mnie na spalanie 17l/100',
	image: 'https://www.topcarsmotion.com/wp-content/uploads/2017/11/ford-mustang-coupe-5.0-morro-lateral.jpg',
	car,
	endDate: tomorrow,
	minimalPrice: 10
}))
module.exports.seedOffer = (auctionId, userId) => [1,2,3].map(() => Offer.create({ auctionId, price: 10, userId }))
