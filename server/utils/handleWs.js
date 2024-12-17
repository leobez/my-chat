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

        // Common events
        socket.on('disconnect', () => SocketController.disconnect(socket))

        // Message events
        socket.on('private message', (data) => SocketController.sendPrivateMessage(socket, data))

        // Friendship events
        socket.on('friend request', (data) => SocketController.sendFriendRequest(socket, data))

    })
}

module.exports = {
    handleWsMiddlewares,
    handleWsRoutes
}