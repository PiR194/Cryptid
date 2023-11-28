import { io } from "socket.io-client";
import { ADRESSE_WEBSERVER } from "./adressConfig";

const socket = io(ADRESSE_WEBSERVER);

export {socket}