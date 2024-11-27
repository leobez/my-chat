const JsonVerifier = (err, req, res, next) => {

    if (err instanceof SyntaxError) {
        return res.status(400).json({
            message: 'Invalid JSON syntax',
            details: ['JSON body sent in request is invalid']
        })
    }

    next()
}

module.exports = JsonVerifier