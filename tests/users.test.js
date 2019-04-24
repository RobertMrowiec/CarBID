const request = require('supertest')
const { seedUsers } = require('../seeds/seed')
const { generateToken } = require('./token')
const User = require('../models/User')
const mongoose = require('mongoose')
const app = require('../app')
let token
let userId

beforeAll(() => mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true })
	.then(() => User.deleteMany({}))
	.then(async () => token = await generateToken())
	.then(() => seedUsers()))

describe('GET Users', () => {
	test('Get users', () => {
		request(app).get('/api/users').then(users => {
			expect(200)
			expect(Array.isArray(users)).toBeTruthy()
			expect(users[0]._id).toBeDefined()
			userId = users[0]._id
		})
	})
})

describe('GET User by ID', () => {
	test('Get user by ID', () => {
		request(app).get(`/api/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.then(user => {
				expect(200)
				expect(user._id).toEqual(userId)
			})
	})
})

describe('POST Users', () => {
	test('throw error if password is invalid', () => {
		request(app)
			.post(`/api/users`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test@herecars.com',
				name: 'hellothere',
				password: 'hello'
			})
			.then(result => {
				expect(400)
				expect(result.message).toEqual(['"password" length must be at least 6 characters long'])
			})
	})

	test('throw error if email is invalid', () => {
		request(app)
			.post(`/api/users`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test@herrecars.com',
				name: 'hellothere',
				password: 'hello123'
			})
			.then(result => {
				expect(400)
				expect(result.message).toEqual(['"email" with value "test@herrecars.com" fails to match the required pattern: /([a-zA-Z0-9.-])\\w+[@]+(herecars.com)$/'])
			})
	})

	test('throw error if name is not presented', () => {
		request(app)
			.post(`/api/users`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test@herecars.com',
				password: 'hello123'
			})
			.then(result => {
				expect(400)
				expect(result.message).toEqual(["\"name\" is required"])
			})
	})

	test('should add user to db if body data passes a validation', () => {
		request(app)
			.post(`/api/users`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test@herecars.com',
				name: 'hellothere',
				password: 'qwe123'
			})
			.then(user => {
				expect(200)
				expect(user._id).toBeDefined()
				expect(user.name).toEqual('hellothere')
				expect(user.password).not.toEqual('hello123')
				expect(user.email).toEqual('test@herecars.com')
			})
	})
})

describe('LOGIN User', () => {
	test('login user if credentials are valid', () => {
		request(app)
			.post(`/login`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.send({
				email: 'test@herecars.com',
				password: 'hello123'
			})
			.then(result => {
				expect(result.token).toBeDefined()
				expect(result.user.email).toEqual('test@herecars.com')
				expect(result.user.password).not.toEqual('hello123')
				expect(200)
			})
	})
})

describe('Update User by ID', () => {
	test('should edit user if body data match validations', () => {
		request(app)
			.put(`/api/users/${userId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test123@herecars.com',
				name: 'secondtest',
				password: 'secondhello123'
			})
			.then(user => {
				expect(200)
				expect(user._id).toBeDefined()
				expect(user.email).toEqual('test123@herecars.com')
				expect(user.name).toEqual('secondtest')
				expect(user.password).toEqual('secondhello123')
			})
	})
	test('throw error if email is invalid during editing user', () => {
		request(app)
			.put(`/api/users/${userId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test@hecars.com',
				name: 'hellothere',
				password: 'hello123'
			})
			.then(result => {
				expect(400)
				expect(result.message).toEqual(['"email" with value "test@hecars.com" fails to match the required pattern: /([a-zA-Z0-9.-])\\w+[@]+(herecars.com)$/'])
			})
	})

	test('throw error if password is invalid during editing user', () => {
		request(app)
			.put(`/api/users/${userId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test@herecars.com',
				name: 'hellothere',
				password: 'qwe'
			})
			.then(result => {
				expect(400)
				expect(result.message).toEqual(['"password" length must be at least 6 characters long'])
			})
	})
})

describe('Delete User by ID', () => {
	test('Delete user by ID', () => {
		request(app)
			.delete(`/api/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.then(user => {
				expect(200)
				expect(user._id).toEqual(userId)
			})
	})
})
