interface OnlineStatus {
    friendId: number,
    online: boolean
}

class SocketService {

    static async friendOnlineStatus(onlineStatus:OnlineStatus) {
        console.log('onlineStatus: ', onlineStatus)
    }

}

export default SocketService