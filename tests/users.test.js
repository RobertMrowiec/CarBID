const fetch = require('node-fetch')
const { seedUsers } = require('../seeds/seed')
const { generateToken } = require('./token')
const User = require('../models/User')
const mongoose = require('mongoose')
const url = 'http://localhost:8007/api'
let token
let userId

beforeAll(() => mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true })
    .then(() => User.deleteMany({}))
    .then(async () => token = await generateToken())
    .then(() => seedUsers()))

describe('GET Users', () => {
    test('Get users', () => {
        return fetch(`${url}/users`, { headers: { 'Authorization': `Bearer ${token}`}})
        .then(result => result.json())
        .then(users => {
            expect(200)
            expect(Array.isArray(users)).toBeTruthy()
            expect(users[0]._id).toBeDefined()
            userId = users[0]._id
        })
    })
})

describe('GET User by ID', () => {
    test('Get user by ID', () => {
        return fetch(`${url}/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}`}})
        .then(result => result.json())
        .then(user => {
            expect(200)
            expect(user._id).toEqual(userId)
        })
    })
})

describe('POST Users', () => {
    test('throw error if password is invalid', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                name: 'hellothere',
                password: 'hello'
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(['"password" length must be at least 6 characters long'])
        })
    })
    test('throw error if email is invalid', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test@herrecars.com',
                name: 'hellothere',
                password: 'hello123'
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(['"email" with value \"test@herrecars.com\" fails to match the required pattern: /([a-zA-Z0-9.-])\\w+[@]+(herecars.com)$/'])
        })
    })
    test('throw error if name is not presented', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                password: 'hello123'
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(result.errors).toBeDefined()
            expect(result.errors.name.message).toEqual('Path `name` is required.')
        })
    })
    test('should add user to db if body data passes a validation', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                name: 'hellothere',
                password: 'qwe123'
            })
        })
        .then(result => result.json())
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
        return fetch(`http://localhost:8007/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                password: 'hello123'
            })
        })
        .then(result => result.json())
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
        return fetch(`${url}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test123@herecars.com',
                name: 'secondtest',
                password: 'secondhello123'
            })
        })
        .then(result => result.json())
        .then(user => {
            expect(200)
            expect(user._id).toBeDefined()
            expect(user.email).toEqual('test123@herecars.com')
            expect(user.name).toEqual('secondtest')
            expect(user.password).toEqual('secondhello123')
        })
    })
    test('throw error if email is invalid during editing user', () => {
        return fetch(`${url}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test@hecars.com',
                name: 'hellothere',
                password: 'hello123'
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(['"email" with value \"test@hecars.com\" fails to match the required pattern: /([a-zA-Z0-9.-])\\w+[@]+(herecars.com)$/'])
        })
    })

    test('throw error if password is invalid during editing user', () => {
        return fetch(`${url}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                name: 'hellothere',
                password: 'qwe'
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(['"password" length must be at least 6 characters long'])
        })
    })
})

describe('Delete User by ID', () => {
    test('Delete user by ID', () => {
        return fetch(`${url}/users/${userId}`, { method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}})
            .then(result => result.json())
            .then(user => {
                expect(200)
                expect(user._id).toEqual(userId)
            })
    })
})
