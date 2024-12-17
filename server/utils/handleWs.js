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

        // Broadcast to socket friends that he is online
        SocketController.notifyFriendsOnline(socket, io)

        // Common events
        socket.on('disconnect', () => {
            SocketController.notifyFriendsOffline(socket, io)
            SocketController.disconnect(socket)
        })

        // Message events
        socket.on('private message', (messageId) => SocketController.sendPrivateMessage(socket, messageId))

        // Friendship events
        socket.on('friend request', (friendshipId) => SocketController.sendFriendRequest(socket, friendshipId))
        socket.on('accept friend request', (friendshipId) => SocketController.acceptFriendRequest(socket, friendshipId))

    })
}

module.exports = {
    handleWsMiddlewares,
    handleWsRoutes
}