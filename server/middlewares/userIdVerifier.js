const userIdVerifier = (req, res, next) => {

    try {
        
        const jwt = req.cookies.jwt 

        console.log('jwt: ', jwt)

    } catch (error) {
        
    }

    next()
}

module.exports = userIdVerifier