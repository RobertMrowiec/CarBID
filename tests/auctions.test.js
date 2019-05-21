const request = require('supertest')
const Car = require('../models/Car')
const User = require('../models/User')
const mongoose = require('mongoose')
const FormData = require('form-data')
const Auction = require('../models/Auction')
const { generateToken } = require('./token')
const { seedAuctions } = require('../seeds/seed')

const app = require('../app')

let carId
let token
let auctionId
let userId
let form = new FormData()

beforeAll(() => mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true })
	.then(async () => {
		let tokenResult = await generateToken()
		userId = tokenResult.userId
		token = tokenResult.token
	})
	.then(() => Auction.deleteMany({}))
	.then(async () => {
		const tempCar = await Car.create({ brand: 'Ford', model: 'Mustard', maxTorque: 200 })
		carId = tempCar._id
		const tempUser = await User.create({ name: 'seed', surname: 'seedSurname', password: 'seed123', email: 'seed@herecars.com'})
		
		await seedAuctions(tempCar, tempUser)
	})
)

describe('GET auctions', () => {
	test('get array of auctions', () => {
		request(app)
			.get('/api/cars')
			.set('Authorization', `Bearer ${token}`)
			.then(cars => {
				expect(200)
				expect(Array.isArray(cars.data)).toBeTruthy()
			})
	})
})
describe('GET auction by ID', () => {
	request(app)
		.get(`/api/auctions/${auctionId}`)
		.set('Authorization', `Bearer ${token}`)
		.then(auction => {
			expect(200)
			expect(auction._id).toEqual(auctionId)
		})
})

describe('ADD auctions', () => {
	test('add auction if body passes the validation', () => {
		form.append('name', 'test')
		form.append('description', 'test description')
		form.append('car', carId.toString())
		form.append('user', userId.toString())
		form.append('minimalPrice', 100)
		form.append('image', 'test.png')
	
		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(auction => {
				expect(200)
				expect(auction._id).toBeDefined()
				expect(auction.name).toEqual('test')
			})
	})

	test('throw error if name is not defined', () => {
		form.append('description', 'test description')
		form.append('user', userId.toString())
		form.append('car', carId.toString())
		form.append('minimalPrice', 100)
		form.append('image', 'test.png')

		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual(["'name' is required"])
			})
	})

	test('throw error if description is not defined', () => {
		form.append('name', 'test')
		form.append('user', userId.toString())
		form.append('car', carId.toString())
		form.append('minimalPrice', 100)
		form.append('image', 'test.png')

		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual(["'description' is required"])
			})
	})

	test('throw error if description length is more than 200 chars', () => {
		form.append('name', 'qwe')
		form.append('description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu ultricies justo. Mauris sollicitudin, nisl sit amet ornare vestibulum, nisl leo ultricies felis, eget hendrerit orci mi non dolor. Quisque')
		form.append('user', userId.toString())
		form.append('car', carId.toString())
		form.append('minimalPrice', 100)
		form.append('image', 'test.png')

		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual(['"description" length must be less than or equal to 200 characters long'])
			})
	})

	test('throw error if image is not defined', () => {
		form.append('name', 'name')
		form.append('user', userId.toString())
		form.append('description', 'test description')
		form.append('car', carId.toString())
		form.append('minimalPrice', 100)

		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual(["'image' is required"])
			})
	})
	test('throw error if car is not defined', () => {
		form.append('name', 'test')
		form.append('user', userId.toString())
		form.append('description', 'test description')
		form.append('minimalPrice', 100)
		form.append('image', 'test.png')
	
		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual([`"car" is required`])
			})
	})
	test('throw error if minimalPrice is negative', () => {
		form.append('name', 'test')
		form.append('user', userId.toString())
		form.append('description', 'test description')
		form.append('car', carId.toString())
		form.append('minimalPrice', -100)
		form.append('image', 'test.png')
	
		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual(['"minimalPrice" must be larger than or equal to 0'])
			})
	})
	test('throw error if userId is not defined', () => {
		form.append('name', 'test')
		form.append('description', 'test description')
		form.append('car', carId.toString())
		form.append('minimalPrice', 100)
		form.append('image', 'test.png')
	
		request(app)
			.post('/api/auctions')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(form)
			.then(result => {
				expect(400)
				expect(result).toEqual(['"userId" is required'])
			})
	})

})

describe('Update auction', () => {
	test('update auctiion if body passes the validation', () => {
		request(app)
			.put(`/api/auctions/${auctionId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'test2',
				description: 'hello2',
				image: 'asd3.jpg',
				car: carId,
				minimalPrice: 15
			})
			.then(auction => {
				expect(200)
				expect(auction._id).toBeDefined()
				expect(auction.name).toEqual('test2')
			})
	})
	test('throw error if description length is more than 200 chars', () => {
		request(app)
			.put(`/api/auctions/${auctionId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'test',
				image: 'test.png',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu ultricies justo. Mauris sollicitudin, nisl sit amet ornare vestibulum, nisl leo ultricies felis, eget hendrerit orci mi non dolor. Quisque',
				car: carId
			})
			.then(result => {
				expect(400)
				expect(result).toEqual(['"description" length must be less than or equal to 200 characters long'])
			})
	})
	test('throw error if minimalPrice is negative', () => {
		request(app)
			.put(`/api/auctions/${auctionId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'test',
				image: 'test.png',
				description: 'test',
				car: carId,
				minimalPrice: -10
			})
			.then(result => {
				expect(400)
				expect(result).toEqual(["'minimalPrice' must be larger than or equal to 0"])
			})
	})
})

describe('DELETE auctions', () => {
	test('remove auction by it`s ID', () => {
		request(app)
			.delete(`/api/auctions/${auctionId}`)
			.set('Authorization', `Bearer ${token}`)
			.then(auction => {
				expect(200)
				expect(auction._id).toEqual(auctionId)
			})
	})
})