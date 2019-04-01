const User = require('../../models/User')
const { defaultResponse } = require('../common')

exports.get = defaultResponse(() => User.find())

exports.getById = defaultResponse(req => User.findById(req.params.id))

exports.pagination = defaultResponse(req => {
    const limit = Number(req.params.limit)
    return User.find().skip(limit * (req.params.page - 1)).limit(limit)
})
exports.add = defaultResponse(req => new User(req.body).save())

exports.update = defaultResponse(req => User.findByIdAndUpdate(req.params.id, req.body, {new: true}))

exports.delete = defaultResponse(req => User.findByIdAndDelete(req.params.id))