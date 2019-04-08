const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { defaultResponse } = require('../common')
const { userValidate } = require('../../validation/user')

exports.get = defaultResponse(() => User.find().populate('auctions').populate('car'))

exports.getById = defaultResponse(req => User.findById(req.params.id))

exports.pagination = defaultResponse(async req => {
    const limit = Number(req.params.limit)
    return User.find().skip(limit * (req.params.page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
    const result = await userValidate(req.body)
    req.body.password = bcrypt.hashSync(req.body.password, 5)
    
    return !result.length ? new User(req.body).save() : result
})

exports.update = defaultResponse(async req => {
    const result = await userValidate(req.body)
    return !result.length ? User.findByIdAndUpdate(req.params.id, req.body, {new: true}) : result
})

exports.delete = defaultResponse(req => User.findByIdAndDelete(req.params.id))