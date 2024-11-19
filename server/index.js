const express = require('express')
const path = require('path')
const {createServer} = require('node:http')
const {Server} = require('socket.io')

const app = express()
const server = createServer(app)

const io = new Server(server, {
    connectionStateRecovery: {}
})

var qtd = 0;

// When accessed, send static files from /client/build to user
app.use(express.static(path.resolve(__dirname, '../client/dist')))

io.on('connection', (socket) => {

    qtd++;

    console.log('a user connected')
    console.log('users connected: ', qtd)

    socket.on('disconnect', () => {
        qtd--;
        console.log('user disconnected')
        console.log('users connected: ', qtd)
    })

    socket.on('message', (msg) => {
        console.log('message: ' + msg)
        io.emit('message', msg)
    })
})

// Handle GET calls
app.get('/api', (req, res) => {
    res.json({message: 'Hello from server'})
})

// Handle untreated GET calls
app.get('', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
})

server.listen(3000, () => {
    console.log('listening at 3000')
})
