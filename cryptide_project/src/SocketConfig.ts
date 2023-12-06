import { io } from "socket.io-client";
import { ADRESSE_WEBSERVER } from "./AdressSetup";

const socket = io(ADRESSE_WEBSERVER);

console.log(ADRESSE_WEBSERVER)
console.log(socket.id)

export {socket}