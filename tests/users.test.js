const fetch = require('node-fetch')
const { seedUsers } = require('../seeds/users')
const mongoose = require('mongoose')
const url = 'http://localhost:8007/api'
let userId

beforeAll(() => {
    mongoose.connect('mongodb://localhost/carbid').then(() => {
        seedUsers()
    })
})

describe('GET Users', () => {
    test('Get users', () => {
        return fetch(`${url}/users`).then(x => x.json()).then(x => {
            expect(200)
            expect(Array.isArray(x)).toBeTruthy()
            expect(x[0]._id).toBeDefined()
            userId = x[0]._id
        })
    })
})

describe('GET User by ID', () => {
    test('Get user by ID', () => {
        return fetch(`${url}/users/${userId}`).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toEqual(userId)
        })
    })
})

describe('POST Users', () => {
    test('throw error if password is invalid', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                name: 'hellothere',
                password: 'hello'
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(['"password" length must be at least 6 characters long'])
        })
    })
    test('throw error if email is invalid', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test@herrecars.com',
                name: 'hellothere',
                password: 'hello123'
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(['"email" with value "test@herrecars.com" fails to match the required pattern: /([a-z][a-zA-Z0-9.-])\\w+[@]+(herecars.com)/'])
        })
    })
    test('throw error if name is not presented', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                password: 'hello123'
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x.errors).toBeDefined()
            expect(x.errors.name.message).toEqual('Path `name` is required.')
        })
    })
    test('should add user to db if body data passes a validation', () => {
        return fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                name: 'hellothere',
                password: 'hello123'
            })
        }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toBeDefined()
            expect(x.name).toEqual('hellothere')
            expect(x.password).toEqual('hello123')
            expect(x.email).toEqual('test@herecars.com')
        })
    })
})

describe('Update User by ID', () => {
    test('should edit user if body data match validations', () => {
        return fetch(`${url}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test123@herecars.com',
                name: 'secondtest',
                password: 'secondhello123'
            })
        }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toBeDefined()
            expect(x.email).toEqual('test123@herecars.com')
            expect(x.name).toEqual('secondtest')
            expect(x.password).toEqual('secondhello123')
        })
    })
    test('throw error if email is invalid during editing user', () => {
        return fetch(`${url}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test@hecars.com',
                name: 'hellothere',
                password: 'hello123'
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(['"email" with value "test@hecars.com" fails to match the required pattern: /([a-z][a-zA-Z0-9.-])\\w+[@]+(herecars.com)/'])
        })
    })

    test('throw error if password is invalid during editing user', () => {
        return fetch(`${url}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                email: 'test@herecars.com',
                name: 'hellothere',
                password: 'qwe'
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(['"password" length must be at least 6 characters long'])
        })
    })
})

describe('Delete User by ID', () => {
    test('Delete user by ID', () => {
        return fetch(`${url}/users/${userId}`, { method: 'DELETE' }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toEqual(userId)
        })
    })
})
