const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const JsonVerifier = require('./middlewares/JsonVerifier')
const expressValidator = require('express-validator')
require('dotenv').config()
// Initiate DB
require('./db/db')

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
    }
})

io.use((socket, next) => {
    const email = socket.handshake.auth.email

    // Validate email 
    // TODO: Validate if email exists on database

    if (!email) {
        return next(new Error('No email'))
    }

    socket.email = email
    next()
})

// Any user has connected
io.on('connection', (socket) => {

    console.log('connected: ', socket.id)

    // Create list of current connected sockets
    const connected_users = []
    for (let [id, socket] of io.of('/').sockets) {
        connected_users.push({
            userId: id,
            email: socket.email
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
    })

});

httpServer.listen(3000, () => {
    console.log('SERVER ON 3000')
})
