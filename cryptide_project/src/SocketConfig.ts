import { io } from "socket.io-client";
import { ADRESSE_WEBSERVER } from "./AdressSetup";

const socket = io(ADRESSE_WEBSERVER, {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'https://codefirst.iut.uca.fr/containers/Crypteam-website:80', // Replace with your client's domain and port
    'Access-Control-Allow-Credentials': 'true'
  }
});

console.log(ADRESSE_WEBSERVER)
console.log(socket.id)

export {socket}