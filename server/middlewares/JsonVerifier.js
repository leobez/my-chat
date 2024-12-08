const JsonVerifier = (err, req, res, next) => {
    
    if (err) {
        if (err instanceof SyntaxError) {
            return res.status(400).json({
                message: 'Invalid JSON syntax',
                details: ['JSON body sent in request is invalid']
            })
        } else {
            return res.status(400).json({
                message: 'Bad request',
                details: ['Something went wrong while sending requisition']
            })
        }
    } 

    next()
}

module.exports = JsonVerifier