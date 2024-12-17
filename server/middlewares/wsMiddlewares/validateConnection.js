const {getSocketInfo, getSocketIdByUserId, updateSocketId} = require('../../utils/userWrapper')

const validateConnection = (socket, next) => {

    // Validate userId in handshake
    const userId = socket.handshake.auth.userId

    if (!userId) {
        const err = new Error('Bad request')
        err.data = {details: ['No userId detected']}
        return next(err)
    }

    // See if cookies has JWT
    const isJWTIncluded = socket.handshake.headers.cookie.includes('jwt=')
    if (!isJWTIncluded) {
        const err = new Error('Bad request')
        err.data = {details: ['No JWT detected']}
        return next(err)
    }

    // Get JWT from cookies
    const cookiesArray = socket.handshake.headers.cookie.split(' ')
    let token = ''
    for (let cookie of cookiesArray) {
        if (cookie.includes('jwt=')) {
            token = cookie.split('jwt=')[1]
        }
    }

    try {

        // Validate JWT 
        const userData = jwt.verify(token, SECRET)

        // Validate if userId on auth is the same than the one on cookie
        if (userId != userData.userId) {
            /* console.log('userId: ', userId)
            console.log('userData.userId: ', userData.userId) */
            const err = new Error('Bad request')
            err.data = {details: ['Invalid userId']}
            return next(err)
        } 

        socket.user = {
            userId: userData.userId,
            email: userData.email,
            username: userData.username,
        }

    } catch (error) {
        const err = new Error('Server error')
        err.data = {details: ['Failed to validate JWT token']}
        return next(err)
    }

    next()
}

module.exports = validateConnection