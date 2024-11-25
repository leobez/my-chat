import { Socket } from "socket.io-client";

export interface User {
    id: number;
    isLoggedIn: boolean;
    email: string,
    username: string;
    socket: Socket;
    friendList: number[];
    groupList: number[];
}