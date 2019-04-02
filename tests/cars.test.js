const fetch = require('node-fetch')
const url = 'http://localhost:8007/api'
let carId

describe('GET Cars', () => {
    test('Get cars', () => {
        return fetch(`${url}/cars`).then(x => x.json()).then(x => {
            expect(200)
            expect(Array.isArray(x)).toBeTruthy()
            expect(x[0]._id).toBeDefined()
            carId = x[0]._id
        })
    })
})

describe('GET Car by ID', () => {
    test('Get car by ID', () => {
        return fetch(`${url}/cars/${carId}`).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toEqual(carId)
        })
    })
})

describe('POST Cars', () => {
    test('throw error if brand is undefined', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                model: 'S',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual([`\"brand\" is required`])
        })
    })
    test('throw error if model is undefined', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(["\"model\" is required"])
        })
    })
    test('throw error if horsePower is negative', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: 'S',
                assembledAt: new Date(),
                horsePower: -100,
                maxTorque: 200
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(["\"horsePower\" must be larger than or equal to 0"])
        })
    })
    test('throw error if maxTorque is negative', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: 'S',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: -200
            })
        }).then(x => x.json()).then(x => {
            expect(400)
            expect(Array.isArray(x)).toEqual(true)
            expect(x).toEqual(["\"maxTorque\" must be larger than or equal to 0"])
        })
    })

    test('should add car to db if body data passes a validation', () => {
        return fetch(`${url}/cars`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                brand: 'Tesla',
                model: 'S',
                assembledAt: new Date(),
                horsePower: 100,
                maxTorque: 200
            })
        }).then(x => x.json()).then(x => {
            expect(200)
            expect(x._id).toBeDefined()
            expect(x.model).toEqual('S')
            expect(x.brand).toEqual('Tesla')
            expect(x.maxTorque).toEqual(200)
        })
    })
})

// describe('Update Car by ID', () => {
//     test('should edit car if body data match validations', () => {
//         return fetch(`${url}/cars/${carId}`, {
//             method: 'PUT',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },          
//             body: JSON.stringify({
//                 email: 'test123@herecars.com',
//                 name: 'secondtest',
//                 password: 'secondhello123'
//             })
//         }).then(x => x.json()).then(x => {
//             expect(200)
//             expect(x._id).toBeDefined()
//             expect(x.email).toEqual('test123@herecars.com')
//             expect(x.name).toEqual('secondtest')
//             expect(x.password).toEqual('secondhello123')
//         })
//     })
//     test('throw error if email is invalid during editing car', () => {
//         return fetch(`${url}/cars/${carId}`, {
//             method: 'PUT',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },          
//             body: JSON.stringify({
//                 email: 'test@hecars.com',
//                 name: 'hellothere',
//                 password: 'hello123'
//             })
//         }).then(x => x.json()).then(x => {
//             expect(400)
//             expect(Array.isArray(x)).toEqual(true)
//             expect(x).toEqual(['"email" with value "test@hecars.com" fails to match the required pattern: /([a-z][a-zA-Z0-9.-])\\w+[@]+(herecars.com)/'])
//         })
//     })

//     test('throw error if password is invalid during editing car', () => {
//         return fetch(`${url}/cars/${carId}`, {
//             method: 'PUT',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },          
//             body: JSON.stringify({
//                 email: 'test@herecars.com',
//                 name: 'hellothere',
//                 password: 'qwe'
//             })
//         }).then(x => x.json()).then(x => {
//             expect(400)
//             expect(Array.isArray(x)).toEqual(true)
//             expect(x).toEqual(['"password" length must be at least 6 characters long'])
//         })
//     })
// })

// describe('Delete Car by ID', () => {
//     test('Delete car by ID', () => {
//         return fetch(`${url}/cars/${carId}`, { method: 'DELETE' }).then(x => x.json()).then(x => {
//             expect(200)
//             expect(x._id).toEqual(carId)
//         })
//     })
// })
