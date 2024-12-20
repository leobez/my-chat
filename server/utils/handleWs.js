// Controller
const SocketController = require('../controllers/SocketController')

const handleWsMiddlewares = (io) => {
    console.log('handling ws middlewares')
    io.use(require('../middlewares/wsMiddlewares/wsTokenValidator'))
    io.use(require('../middlewares/wsMiddlewares/mapUserIdToSocketId')) 
}

const handleWsRoutes = (io) => {

    /* 
        EVENTS:

        ------/-----

            connection
                -> iterate over users friend and emit on event 'online status' {status:true}

            disconnect
                -> iterate over users friend and emit on event 'online status' {status:false}

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
                -> EMIT: sends friendshipId to a single user thats supposed to receive it
                -> LISTEN: receives a friendship request from the user that sent it

            accept friendship
                -> EMIT: sends an accepted friendshipId to a single user thats supposed to receive it
                -> LISTEN: receives an accepted friendship request from the user that sent it

            deny friendship
                -> EMIT: sends a denied friendshipId to a single user thats supposed to receive it
                -> LISTEN: receives a denied friendship request from the user that sent it

            delete friendship
                -> EMIT: sends a deleted friendshipId to a single user thats supposed to receive it
                -> LISTEN: receives an deleted friendshipId from the user that sent it

        ------/-----

            enter adm room  
                -> EMIT: emit a request to a enter the adm room of a specific groupId

            enter user room
                -> EMIT: emit a request to a enter the user room of a specific groupId

        ------/-----

            membership
                -> EMIT: sends membershipId to a single room thats supposed to receive it
                -> LISTEN: receives a membership request from the user that sent it

            accept membership
                -> EMIT: 
                -> LISTEN: 

            deny friendship
                -> EMIT: 
                -> LISTEN: 

            delete friendship
                -> EMIT: 
                -> LISTEN:  

    
    */

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

        // Group events
        //
        // When a group is accessed, two rooms are created for it
        //
        // ${groupId}_adm_room: only owner and admins of group are inside
        //      -> When a user sends membership request, he sends to this group
        //
        // ${groupId}_users_room: evetyone of a group, including owner and admins are inside
        //      -> Used for message exchanging within group.
        //
        socket.on('enter adm room', (groupId) => SocketController.enterAdmRoom(socket, groupId))
        socket.on('enter user room', (groupId) => SocketController.enterUserRoom(socket, groupId))

        // TODO: NOTIFY ALL USERS IN GROUP THAT NEW USER HAS ENTERED

        // Membership events
        socket.on('membership request', (membershipId) => SocketController.sendMembershipRequest(socket, io, membershipId))

        socket.on('accept membership request', (membershipId) => SocketController.acceptMembershipRequest(socket, io, membershipId))
        
        /*socket.on('delete membership request')
        socket.on('user role updated') */

    })
}

module.exports = {
    handleWsMiddlewares,
    handleWsRoutes
}