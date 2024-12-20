// Controller
const SocketController = require('../controllers/SocketController')

const handleWsMiddlewares = (io) => {
    console.log('handling ws middlewares')
    io.use(require('../middlewares/wsMiddlewares/wsTokenValidator'))
    io.use(require('../middlewares/wsMiddlewares/mapUserIdToSocketId')) 
}

const handleWsRoutes = (io) => {

    console.log('handling ws routes')

    /* 
        WHAT DO I WANT TO BE IN REAL TIME:
            -> online/offline status
            -> private messages
            -> group messages
            -> friendship requests (sending, accepting, denying, deleting)
            -> membership requests (sending, accepting, denying, deleting)

        EVENTS:

        ------/-----

            connection
                -> iterate over users friend and emit on event 'friend online status' {status:true}

            disconnect
                -> iterate over users friend and emit on event 'friend online status' {status:false}

            error
                -> When any error occurs, user must be listening to this event

        ------/-----

            private message
                -> EMIT: sends messageId to a single user thats supposed to receive it
                -> LISTEN: receives a message from the user that sent it

        ------/-----

            group message
                -> EMIT: sends groupMessageId to a single room thats supposed to receive it
                -> LISTEN: receives a groupMessageId from a room that user is in

        ------/-----

            friendship
                -> EMIT: 
                -> LISTEN:

        ------/-----

            enter adm room  
                -> EMIT: emit a request to a enter the adm room of a specific groupId

            enter user room
                -> EMIT: emit a request to a enter the user room of a specific groupId

        ------/-----

            membership
                -> EMIT: sends membershipId to a single room thats supposed to receive it
                -> LISTEN: receives a membership request from the user that sent it

    */

    io.on('connection', (socket) => {

        console.log('A new socket has connected: ', socket.id)
        console.log('Socket belongs to: ', socket.user)

        // Broadcast to socket friends that he is online
        SocketController.notifyFriendsOnline(socket, io)

        // Broadcast to socket friends tha he is offline
        socket.on('disconnect', () => {
            SocketController.notifyFriendsOffline(socket, io)
            SocketController.disconnect(socket)
        })

        // Message events
        socket.on('private message', (messageId) => {
            SocketController.privateMessage(socket, messageId)
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
}

module.exports = {
    handleWsMiddlewares,
    handleWsRoutes
}