// Controller
const SocketController = require('../controllers/SocketController')

const handleWsMiddlewares = (io) => {
    console.log('handling ws middlewares')
    io.use(require('../middlewares/wsMiddlewares/wsTokenValidator'))
    io.use(require('../middlewares/wsMiddlewares/mapUserIdToSocketId')) 
}

const handleWsRoutes = (io) => {

    console.log('handling ws routes')

    io.on('connection', (socket) => {

        console.log('A new socket has connected: ', socket.id)
        console.log('Socket belongs to: ', socket.user)

        // Message events
        socket.on('private message', SocketController.sendPrivateMessage)

        // Friendship events
        // ...
    })
}

module.exports = {
    handleWsMiddlewares,
    handleWsRoutes
}