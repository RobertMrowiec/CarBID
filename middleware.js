const jwt = require('jsonwebtoken')

module.exports.middlewareLogin = (req, res, next) => {
    if (req.url.startsWith('/api')) {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.privateKey, (err, decoded) => {
                err ? res.status(403).json("Authorization failed") : next()
            })
        } else {
            return res.status(403).json("Authorization failed")
        }
    } else next()
}