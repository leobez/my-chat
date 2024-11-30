const { validationResult } = require("express-validator")

const ValidateMiddleware = (validations) => {

    return async (req, res, next) => {

        for (const validation of validations) {
            
            const result = await validation.run(req)

            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: 'Error on data validation',
                    details: result.array()
                })
            }

        }

        next()

    }
}

module.exports = ValidateMiddleware