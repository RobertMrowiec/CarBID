const request = require('supertest')
const { seedCars } = require('../seeds/seed')
const { generateToken } = require('./token')
const Car = require('../models/Car')
const mongoose = require('mongoose')
const app = require('../app')
let token
let carId

beforeAll(() => mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true })
	.then(() => Car.deleteMany({}))
	.then(async () => token = await generateToken())
	.then(() => seedCars()))

describe('GET Cars', () => {
	test('Get cars', () => {
		request(app).get('/api/cars')
			.set('Authorization', `Bearer ${token}`)
			.then(cars => {
				expect(200)
				expect(Array.isArray(cars)).toBeTruthy()
				expect(cars[0]._id).toBeDefined()
				carId = cars[0]._id
			})
	})
})

describe('GET Car by ID', () => {
	test('Get car by ID', () => {
		request(app).get(`/api/cars/${carId}`)
			.set('Authorization', `Bearer ${token}`)
			.then(result => result.json())
			.then(car => {
				expect(200)
				expect(car.data.id).toEqual(carId)
			})
	})
})

describe('POST Cars', () => {
	test('throw error if brand is undefined', () => {
		request(app)
			.post('/api/cars')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				model: 'S',
				assembledAt: new Date(),
				horsePower: 100,
				maxTorque: 200
			})
			.then(result => {
				expect(400)
				expect(Array.isArray(result)).toEqual(true)
				expect(result).toEqual([`"brand" is required`])
			})
	})
	test('throw error if model is undefined', () => {
		request(app)
			.post('/api/cars')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				assembledAt: new Date(),
				horsePower: 100,
				maxTorque: 200
			})
			.then(result => {
				expect(400)
				expect(Array.isArray(result)).toEqual(true)
				expect(result).toEqual(["\"model\" is required"])
			})
	})
	test('throw error if horsePower is negative', () => {
		request(app)
			.post('/api/cars')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				model: 'S',
				assembledAt: new Date(),
				horsePower: -100,
				maxTorque: 200
			})
			.then(result => {
				expect(400)
				expect(Array.isArray(result)).toEqual(true)
				expect(result).toEqual(["\"horsePower\" must be larger than or equal to 0"])
			})
	})
	test('throw error if maxTorque is negative', () => {
		request(app)
			.post('/api/cars')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				model: 'S',
				assembledAt: new Date(),
				horsePower: 100,
				maxTorque: -200
			})
			.then(result => {
				expect(400)
				expect(Array.isArray(result)).toEqual(true)
				expect(result).toEqual(["\"maxTorque\" must be larger than or equal to 0"])
			})
	})

	test('should add car to db if body data passes a validation', () => {
		request(app)
			.post('/api/cars')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				model: 'S',
				assembledAt: new Date(),
				horsePower: 100,
				maxTorque: 200
			})
			.then(car => {
				expect(200)
				expect(car._id).toBeDefined()
				expect(car.model).toEqual('S')
				expect(car.brand).toEqual('Tesla')
				expect(car.maxTorque).toEqual(200)
			})
	})
})

describe('Update Car by ID', () => {
	test('should edit car if body data match validations', () => {
		request(app)
			.put(`/api/cars/${carId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				model: '3',
				assembledAt: new Date(),
				horsePower: 100,
				maxTorque: 200
			})
			.then(car => {
				expect(200)
				expect(car._id).toBeDefined()
				expect(car.brand).toEqual('Tesla')
				expect(car.model).toEqual('3')
				expect(car.horsePower).toEqual(100)
			})
	})
	test('throw error if horsePower is less than 0 during editing car', () => {
		request(app)
			.put(`/api/cars/${carId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				model: '3',
				assembledAt: new Date(),
				horsePower: -100,
				maxTorque: 200
			})
			.then(result => {
				expect(400)
				expect(Array.isArray(result)).toEqual(true)
				expect(result).toEqual(["\"horsePower\" must be larger than or equal to 0"])
			})
	})

	test('throw error if password is invalid during editing car', () => {
		request(app)
			.put(`/api/cars/${carId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				brand: 'Tesla',
				model: '3',
				assembledAt: new Date(),
				horsePower: 100,
				maxTorque: -200
			})
			.then(result => {
				expect(400)
				expect(Array.isArray(result)).toEqual(true)
				expect(result).toEqual(["\"maxTorque\" must be larger than or equal to 0"])
			})
	})
})

describe('Delete Car by ID', () => {
	test('Delete car by ID', () => {
		request(app)
			.delete(`/api/cars/${carId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.then(car => {
				expect(200)
				expect(car._id).toEqual(carId)
			})
	})
})
