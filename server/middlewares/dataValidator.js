const { validationResult } = require("express-validator");

function dataValidator(req, res, next) {
     
    const result = validationResult(req)

    if (result.errors.length > 0) {
        return res.status(400).json({
            message: 'Bad request',
            details: result.errors.map((error) => error.msg) // Iterates over result.errors[] and takes only msg string to send back to client
        })
    }

    next()
}

module.exports = dataValidator