function defaultResponse(func) {
    return (req, res) => func(req, res)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err))
}

module.exports.defaultResponse = defaultResponse