const SocketController = require('./controllers/SocketController')
const socketIO = require('socket.io')

let io;

const initSocket = (server) => {

    console.log('initiating socket server')

    io = socketIO(server, {
        connectionStateRecovery: {
            maxDisconnectionDuration: 2*60*1000
        }
    });

    console.log('handling ws middlewares')

    io.use(require('./middlewares/wsMiddlewares/wsTokenValidator'))
    io.use(require('./middlewares/wsMiddlewares/mapUserIdToSocketId')) 

    io.on('connection', (socket) => {

        console.log('A new socket has connected: ', socket.id)
        console.log('Socket belongs to: ', socket.user)

        // Broadcast to socket friends that he is online
        SocketController.notifyFriendsOnline(socket, io)

        // Broadcast to socket friends that he is offline
        socket.on('disconnect', () => {
            console.log('socket disconnecting')
            SocketController.notifyFriendsOffline(socket, io)
            SocketController.disconnect(socket)
        })

        // Message events
        socket.on('private message', (messageId) => {
            SocketController.privateMessage(socket, messageId)
        })

        // GroupMessage events
        socket.on('group message', (groupMessageId) => {
            SocketController.groupMessage(socket, io, groupMessageId)
        })

        // Friendship event
        socket.on('friendship', (friendshipId) => {
            return SocketController.handleFriendship(socket, friendshipId)
        })

        // Group events
        //
        // When a group is accessed, two rooms are created for it
        //
        // ${groupId}_adm_room: only owner and admins of group are inside
        //      -> When a user sends membership request, he sends to this group.
        //
        // ${groupId}_users_room: evetyone of a group, including owner and admins are inside
        //      -> Used for message exchanging within group.
        //
        // TODO: NOTIFY ALL USERS IN GROUP THAT NEW USER HAS ENTERED
        //
        socket.on('enter adm room', (groupId) => {
            SocketController.enterAdmRoom(socket, groupId)
        })
        socket.on('enter user room', (groupId) => {
            SocketController.enterUserRoom(socket, groupId)
        })

        // Membership
        socket.on('membership', (membershipId) => {
            SocketController.handleMembership(socket, io, membershipId)
        })

    })
    // Handle socket event using socket.on()
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
}

module.exports = {
    initSocket,
    getIO
}