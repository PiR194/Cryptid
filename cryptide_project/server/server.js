const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Remplacez par l'URL de votre application React
    methods: ["GET", "POST"],
    credentials: true
  }
});


const map = new Map()
// ... le reste de votre configuration du serveur

server.listen(3002, () => {
  console.log('Serveur Socket.IO écoutant sur le port 3001');
});

io.on('connection', (socket) => {
  console.log(socket.id);  

  socket.on('network created', (network, person, indices, room, start) =>{
    io.to(room).emit("game created", network, person, indices, start)
  });

  socket.on("lobby joined", (room, player) =>{
    if (player.type=="Human"){
      socket.join(room)
    }
    if (map.get(room) == undefined){
      map.set(room, [{type: player.type, id: socket.id, name: player.name}])
    }
    else{
      const tab = map.get(room)
      for(let i = 0; i<tab.length; i++){
        if (tab[i].id === socket.id && player.type==="Human"){
          tab.splice(i, 1)
        }
      }

      if (player.type!=="Human"){
        map.get(room).push({type: player.type, id: player.id, name: player.name})
      }
      else{
        map.get(room).push({type: player.type, id: socket.id, name: player.name})
      }
    }
    
    io.to(room).emit("new player", map.get(room))
  })

  socket.on("lobby created", () =>{
    io.to(socket.id).emit("lobby created", Math.floor(Math.random() * 10000))
  })

  socket.on("already asked", (nodeId, askingPlayer, askedPlayer) =>{
    io.to(askingPlayer.id).emit("already asked", nodeId, askedPlayer)
  })

  socket.on("ask player", (nodeId, playerId, askingPlayer) =>{
    io.to(playerId).emit("asked", nodeId, askingPlayer)
  })

  socket.on("asked all 1by1", (id, playerId) =>{
    io.to(playerId).emit("asked all", id)
  })

  socket.on("asked wrong", (askingPlayer) =>{
    io.to(askingPlayer.id).emit("asked wrong")
  })

  socket.on("disconnect", () =>{
    for (const k of map.keys()){
      const tab = map.get(k)
        for (let i = 0; i<tab.length; i++){
          if (tab[i].id === socket.id){
            tab.splice(i, 1)
            io.to(k).emit("new player", tab)
          }
        }
    }
  })

  socket.on("node checked", (id, works, color, room, playerIndex) =>{
    io.to(room).emit("node checked", id, works, color, playerIndex, socket.id)
  })
  
  socket.on("put correct background", (id) =>{
    io.to(id).emit("put correct background")
  })

  socket.on("put grey background", (id, player) =>{
    io.to(id).emit("put grey background", player)
  })

  socket.on("put imossible grey", (id) =>{
    io.to(id).emit("put imossible grey")
  })

  socket.on("end game", (winnerIndex, room) =>{
    console.log("endgame")
    io.to(room).emit("end game", winnerIndex)
  })
});
