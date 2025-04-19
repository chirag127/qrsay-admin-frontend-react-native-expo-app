import { io } from "socket.io-client";
import env from "../config/environment";

class SocketService {
    constructor() {
        this.socket = null;
        this.socketApiUrl = env.socketApiUrl;
    }

    connect() {
        if (!this.socket) {
            this.socket = io(this.socketApiUrl);
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        if (!this.socket) {
            this.connect();
        }
        return this.socket;
    }

    emitEvent(eventName, data) {
        const socket = this.getSocket();
        socket.emit(eventName, data);
    }

    listenEvent(eventName, callback) {
        const socket = this.getSocket();
        socket.on(eventName, callback);
    }

    removeListener(eventName) {
        const socket = this.getSocket();
        socket.off(eventName);
    }

    removeAllListeners() {
        const socket = this.getSocket();
        socket.removeAllListeners();
    }

    joinRestaurantRoom(restaurantId) {
        const socket = this.getSocket();
        socket.emit("joinRestaurantRoom", restaurantId);
    }
}

export default new SocketService();
