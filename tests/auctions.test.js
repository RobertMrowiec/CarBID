const fetch = require('node-fetch')

const url = 'http://localhost:8007/api'
let auctionId
let carId = '5ca324bc6efe0c381019c229'

describe('GET auctions', () => {
    test('get array of auctions', () => {
        return fetch(`${url}/auctions`).then(x => x.json()).then(x => {
            expect(200)
            expect(Array.isArray(x)).toBeTruthy()
            auctionId = x[0]._id
            // carId = x[0].car._id //from populate field
        })
    })
})
describe('GET auction by ID', () => {
    test('get one auction by ID', () => {
        return fetch(`${url}/auctions/${auctionId}`).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toEqual(auctionId)
        })
    })
})

describe('ADD auctions', () => {
    test('add auctiion if body passes the validation', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                description: 'hello',
                image: 'asd.jpg',
                car: carId,
                minimalPrice: 10
            })
        }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toBeDefined()
            expect(x.name).toEqual('test')
        })
    })
    test('throw error if name is not defined', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                description: 'test',
                image: 'test.png',
                car: carId
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(["\"name\" is required"])
        })
    })
    test('throw error if description is not defined', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                image: 'test.png',
                car: carId
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(["\"description\" is required"])
        })
    })
    test('throw error if description length is more than 200 chars', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                image: 'test.png',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu ultricies justo. Mauris sollicitudin, nisl sit amet ornare vestibulum, nisl leo ultricies felis, eget hendrerit orci mi non dolor. Quisque',
                car: carId
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(['\"description\" length must be less than or equal to 200 characters long'])
        })
    })
    test('throw error if image is not defined', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                description: 'test',
                car: carId
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(["\"image\" is required"])
        })
    })
    test('throw error if car is not defined', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                image: 'test.png',
                description: 'test'
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual([`\"car\" is required`])
        })
    })
    test('throw error if minimalPrice is negative', () => {
        return fetch(`${url}/auctions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                image: 'test.png',
                description: 'test',
                car: carId,
                minimalPrice: -10
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(["\"minimalPrice\" must be larger than or equal to 0"])
        })
    })
})

describe('Update auction', () => {
    test('update auctiion if body passes the validation', () => {
        return fetch(`${url}/auctions/${auctionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test2',
                description: 'hello2',
                image: 'asd3.jpg',
                car: carId,
                minimalPrice: 15
            })
        }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toBeDefined()
            expect(x.name).toEqual('test2')
        })
    })
    test('throw error if description length is more than 200 chars', () => {
        return fetch(`${url}/auctions/${auctionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                image: 'test.png',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu ultricies justo. Mauris sollicitudin, nisl sit amet ornare vestibulum, nisl leo ultricies felis, eget hendrerit orci mi non dolor. Quisque',
                car: carId
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(['"description" length must be less than or equal to 200 characters long'])
        })
    })
    test('throw error if minimalPrice is negative', () => {
        return fetch(`${url}/auctions/${auctionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'test',
                image: 'test.png',
                description: 'test',
                car: carId,
                minimalPrice: -10
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(x).toEqual(["\"minimalPrice\" must be larger than or equal to 0"])
        })
    })
})

describe('DELETE auctions', () => {
    test('remove auction by it`s ID', () => {
        return fetch(`${url}/auctions/${auctionId}`, { method: 'DELETE' }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toEqual(auctionId)
        })
    })
})