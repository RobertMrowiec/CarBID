const fetch = require('node-fetch')
const { seedCars } = require('../seeds/seed')
const { generateToken } = require('./token')
const Car = require('../models/Car')
const mongoose = require('mongoose')
const url = 'http://localhost:8007/api'
let token
let carId

beforeAll(() => mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true })
    .then(() => Car.deleteMany({}))
    .then(async () => token = await generateToken())
    .then(() => seedCars()))

describe('GET Cars', () => {
    test('Get cars', () => {
        return fetch(`${url}/cars`, { headers: { 'Authorization': `Bearer ${token}`}})
        .then(result => result.json())
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
        return fetch(`${url}/cars/${carId}`, { headers: { 'Authorization': `Bearer ${token}`}})
        .then(result => result.json())
        .then(car => {
            expect(200)
            expect(car.data.id).toEqual(carId)
        })
    })
})

describe('POST Cars', () => {
    test('throw error if brand is undefined', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                model: 'S',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual([`\"brand\" is required`])
        })
    })
    test('throw error if model is undefined', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(["\"model\" is required"])
        })
    })
    test('throw error if horsePower is negative', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: 'S',
                assembledAt: new Date(),
                horsePower: -100,
                maxTorque: 200
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(["\"horsePower\" must be larger than or equal to 0"])
        })
    })
    test('throw error if maxTorque is negative', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: 'S',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: -200
            })
        })
        .then(result => result.json())
        .then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(["\"maxTorque\" must be larger than or equal to 0"])
        })
    })

    test('should add car to db if body data passes a validation', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: 'S',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        })
        .then(result => result.json())
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
        return fetch(`${url}/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: '3',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        })
        .then(result => result.json())
        .then(car => {
            expect(200)
            expect(car._id).toBeDefined()
            expect(car.brand).toEqual('Tesla')
            expect(car.model).toEqual('3')
            expect(car.horsePower).toEqual(100)
        })
    })
    test('throw error if horsePower is less than 0 during editing car', () => {
        return fetch(`${url}/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: '3',
                assembledAt: new Date(),
                horsePower: -100,
                maxTorque: 200
            })
        }).then(result => result.json()).then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(["\"horsePower\" must be larger than or equal to 0"])
        })
    })

    test('throw error if password is invalid during editing car', () => {
        return fetch(`${url}/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: '3',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: -200
            })
        }).then(result => result.json()).then(result => {
            expect(400)
            expect(Array.isArray(result)).toEqual(true)
            expect(result).toEqual(["\"maxTorque\" must be larger than or equal to 0"])
        })
    })
})

describe('Delete Car by ID', () => {
    test('Delete car by ID', () => {
        return fetch(`${url}/cars/${carId}`, { method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}})
        .then(result => result.json())
        .then(car => {
            expect(200)
            expect(car._id).toEqual(carId)
        })
    })
})
