const jwt = require('jsonwebtoken')

const _methodNotUserPost = req =>  (req.url !== '/api/users' && req.method === 'POST')
const _methodNotImage = req =>  (req.url !== '/api/images')

module.exports.auth = (req, res, next) => {
	if (req.url.startsWith('/api') && _methodNotUserPost(req) && _methodNotImage(req)) {
		if (req.headers.authorization) {
			let token = req.headers.authorization.split(' ')[1]
			jwt.verify(token, process.env.privateKey, err => {
				err ? res.status(403).json("Authorization failed") : next()
			})
		} else {
			return res.status(403).json("Authorization failed")
		}
	} else next()
}