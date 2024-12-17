// Controller
const SocketController = require('../../controllers/SocketController')

const handleWsMiddlewares = (io) => {
    io.use(require('../../middlewares/wsMiddlewares/validateConnection'))
    io.use(require('../../middlewares/wsMiddlewares/mapUserIdToSocketId'))
}

const handleWsRoutes = (io) => {
    io.on('connection', (socket) => {

        console.log('Socket: ', socket)
    
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