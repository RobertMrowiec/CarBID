const jwt = require('jsonwebtoken')

const _MethodNotUserPost = req =>  (req.url !== '/api/users' && req.method === 'POST')
const _MethodNotImage = req =>  (req.url !== '/api/images')

module.exports.auth = (req, res, next) => {
	if (req.url.startsWith('/api') && _MethodNotUserPost(req) && _MethodNotImage(req)) {
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