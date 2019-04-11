const fetch = require('node-fetch')
const { seedAuctions } = require('../seeds/seed')
const { generateToken } = require('./token')
const Auction = require('../models/Auction')
const Car = require('../models/Car')
const mongoose = require('mongoose')
const url = 'http://localhost:8007/api'
let carId
let token
let auctionId

beforeAll(() => mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true })
	.then(async () => token = await generateToken())
	.then(() => Auction.deleteMany({}))
	.then(async () => {
		const tempCar = await Car.create({ brand: 'Ford', model: 'Mustard', maxTorque: 200 })
		// const tempCar = await Car.findOne({brand: 'Ford'})
		carId = tempCar._id
		
		return seedAuctions(tempCar)
	})
)

describe('GET auctions', () => {
	test('get array of auctions', () => {
		return fetch(`${url}/auctions?page[number]=1&page[size]=2`, { headers: { 'Authorization': `Bearer ${token}`}})
		.then(result => result.json()).then(auctions => {
			expect(200)
			expect(Array.isArray(auctions.data)).toBeTruthy()
			auctionId = auctions.data[0].id
		})
	})
})
describe('GET auction by ID', () => {
	test('get one auction by ID', () => {
		return fetch(`${url}/auctions/${auctionId}`, { headers: { 'Authorization': `Bearer ${token}`}})
			.then(result => result.json())
			.then(auction => {
				expect(200)
				expect(auction._id).toEqual(auctionId)
			})
	})
})

describe('ADD auctions', () => {
	test('add auctiion if body passes the validation', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				description: 'hello',
				image: 'asd.jpg',
				car: carId,
				minimalPrice: 10
			})
		})
		.then(result => result.json())
		.then(auction => {
			expect(200)
			expect(auction._id).toBeDefined()
			expect(auction.name).toEqual('test')
		})
	})
	test('throw error if name is not defined', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				description: 'test',
				image: 'test.png',
				car: carId
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(["\"name\" is required"])
		})
	})
	test('throw error if description is not defined', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				image: 'test.png',
				car: carId
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(["\"description\" is required"])
		})
	})
	test('throw error if description length is more than 200 chars', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				image: 'test.png',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu ultricies justo. Mauris sollicitudin, nisl sit amet ornare vestibulum, nisl leo ultricies felis, eget hendrerit orci mi non dolor. Quisque',
				car: carId
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(['\"description\" length must be less than or equal to 200 characters long'])
		})
	})
	test('throw error if image is not defined', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				description: 'test',
				car: carId
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(["\"image\" is required"])
		})
	})
	test('throw error if car is not defined', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				image: 'test.png',
				description: 'test'
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual([`\"car\" is required`])
		})
	})
	test('throw error if minimalPrice is negative', () => {
		return fetch(`${url}/auctions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				image: 'test.png',
				description: 'test',
				car: carId,
				minimalPrice: -10
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(["\"minimalPrice\" must be larger than or equal to 0"])
		})
	})
})

describe('Update auction', () => {
	test('update auctiion if body passes the validation', () => {
		return fetch(`${url}/auctions/${auctionId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test2',
				description: 'hello2',
				image: 'asd3.jpg',
				car: carId,
				minimalPrice: 15
			})
		})
		.then(result => result.json())
		.then(auction => {
			expect(200)
			expect(auction._id).toBeDefined()
			expect(auction.name).toEqual('test2')
		})
	})
	test('throw error if description length is more than 200 chars', () => {
		return fetch(`${url}/auctions/${auctionId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				image: 'test.png',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu ultricies justo. Mauris sollicitudin, nisl sit amet ornare vestibulum, nisl leo ultricies felis, eget hendrerit orci mi non dolor. Quisque',
				car: carId
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(['"description" length must be less than or equal to 200 characters long'])
		})
	})
	test('throw error if minimalPrice is negative', () => {
		return fetch(`${url}/auctions/${auctionId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: 'test',
				image: 'test.png',
				description: 'test',
				car: carId,
				minimalPrice: -10
			})
		})
		.then(result => result.json())
		.then(result => {
			expect(400)
			expect(result).toEqual(["\"minimalPrice\" must be larger than or equal to 0"])
		})
	})
})

describe('DELETE auctions', () => {
	test('remove auction by it`s ID', () => {
		return fetch(`${url}/auctions/${auctionId}`, { method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}})
			.then(result => result.json())
			.then(auction => {
				expect(200)
				expect(auction._id).toEqual(auctionId)
			})
	})
})