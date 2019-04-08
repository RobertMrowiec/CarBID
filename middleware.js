const jwt = require('jsonwebtoken')

module.exports.auth = (req, res, next) => {
    if (req.url.startsWith('/api' && (req.url !== '/api/users' && req.method === 'POST'))) {
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