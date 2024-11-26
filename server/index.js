const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

// MIDDLEWARES
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())
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


// ROOM
/* 
    id
    name
    desc
    users []
    messages



*/

// Any user has connected
io.on('connection', (socket) => {

    // socket is a user
    // Every user automatically joins a universal room at beggning of connection
    socket.join('universal_room')

    io.to('universal_room').emit('message', 'you have now entered')

    console.log(`Usuário conectado: ${socket.id}`);
    
    // Escuta mensagens do cliente
    socket.on('message', (msg) => {
        console.log(`Mensagem recebida: ${msg}`);
        
        // Envia uma resposta para o cliente
        socket.emit('message', `Recebido: ${msg}`);
    });

    // Quando o cliente se desconecta
    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

// Not being used yet
httpServer.listen(3000, () => {
    console.log('SERVER ON 3000')
})
