import { io } from "socket.io-client";
import { ADRESSE_WEBSERVER } from "./AdressSetup";

const socket = io(ADRESSE_WEBSERVER, {transports: ['websocket'], reconnection: false});

console.log(ADRESSE_WEBSERVER)
console.log(socket.id)

export {socket}