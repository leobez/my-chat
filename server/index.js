require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY
const JsonVerifier = require('./middlewares/JsonVerifier')
require('./db/db') //INITIATE DB

// MIDDLEWARES
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json({
    verify: (req, res, buf, encoding) => { // Verify is user req has any SyntaxError's
        try {  
            if (buf && buf.length) {
                JSON.parse(buf)
            }
        } catch (error) {
            throw new SyntaxError('Invalid JSON')
        }
    }
}))

app.use(JsonVerifier) 
app.use(cookieParser())

// ROUTES
// USER ROUTES
const userRoutes = require('./routes/userRoutes')
app.use('/api/user', userRoutes)

// MESSAGE ROUTES
const messageRoutes = require('./routes/messageRouter')
app.use('/api/message', messageRoutes)

// 404 ROUTE
app.get('', (req, res) => {
    res.status(404).json({message: 'not found'})
})

// WEBSOCKET
const http = require('node:http')
const socketIO = require('socket.io')

const httpServer = http.createServer(app)
const io = new socketIO.Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2*60*1000
    }
})

/* WEBSOCKET MIDDLEWARES */
// Validate connection
io.use((socket, next) => {

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
        const userData = jwt.verify(token, secret)

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
})

// Map userId to their corresponding socketId
io.use(async(socket, next) => {

    // Add socketId on database
    try {
        console.log(`Mapping [userId: ${socket.user.userId}] to [socketId: ${socket.id}]`)
        await updateSocketId(socket.user.userId, socket.id)
        await getSocketInfo()
    } catch (error) {
        const err = new Error('Server error')
        err.data = {details: ['Failed to map userId to socketId']}
        return next(err)
    }
    next()
})

/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
const {getSocketInfo, getSocketIdByUserId, updateSocketId} = require('./utils/sqlite3wrappers')

// Any user has connected
io.on('connection', async(socket) => {

    console.log('A new socket has connected: ', socket.id)
    console.log('User that has connected: ', socket.user)

    socket.on('private message', async({message}) => {

        const receiverUserId = message.to_user

        try {
            const receiverSockerId = await getSocketIdByUserId(receiverUserId)
            console.log(`Transmitting message [${message.content}] to socket: ${receiverSockerId.socketId}`)
            return socket.to(receiverSockerId.socketId).emit('private message', message)
        } catch (error) {
            console.log(error)
            const err = new Error('Server error')
            err.data = {details: error}
            return socket.to(message.from_user).emit('connect_error', err)
        }

    }) 

});

httpServer.listen(3000, () => {
    console.log('SERVER ON 3000')
})








/* // Create list of current connected sockets
const connected_users = []
for (let [id, socket] of io.of('/').sockets) {
connected_users.push({
userId: id,
username: socket.username
})
}

console.log('CURRENT CONNECTED USERS: ', connected_users)

// Emit to user who just connected the list
socket.emit('connected users', connected_users)

socket.on('disconnect', () => {
// Broadcast to every socket that a user has disconnected
socket.broadcast.emit('user disconnected', {
userId: socket.id,
email: socket.email
})
})

// Broadcast to every socket that a new user has arrived
socket.broadcast.emit('user connected', {
userId: socket.id,
email: socket.email,
})

socket.on('private message', ({content, to}) => {
console.log('transmiting message: ', {content, to, from: socket.id})
socket.to(to).emit('private message', {
content, 
from: socket.id
})
}) */