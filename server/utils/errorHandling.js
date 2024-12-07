const { validationResult } = require("express-validator")

function errorHandle (req)  {

    const errors = validationResult(req)

    let errorObj

    if (!errors.isEmpty()) {
        errorObj = {
            message: 'bad request' ,
            details: errors.array().map(err => err.msg)
        }
        //console.log(errorObj)
        return errorObj
    }

    return null
}

module.exports = errorHandle