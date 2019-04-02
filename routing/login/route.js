const express = require('express')
const router = express.Router()
const login = require('./details')

router.post('/', login.login)

module.exports = router