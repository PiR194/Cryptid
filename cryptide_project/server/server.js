const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3000"], // Remplacez par l'URL de votre application React
    methods: ["GET", "POST"],
    credentials: true
  }
});


let lastSocketJoined = ""
const map = new Map()

server.listen(3002, () => {
  console.log('Serveur Socket.IO écoutant sur le port 3002');
});

io.on('connection', (socket) => {
  console.log(socket.id);  

  socket.on('network created', (network, person, indices, room, start) =>{
    io.to(room).emit("game created", network, person, indices, start)
    map.get(room).started = true
    map.get(room).actualPlayer=start
    const playerArray = Array.from(map.entries()).map(([key, value]) => ({ key, value }))
    const playerJson = JSON.stringify(playerArray);
    io.emit("request lobbies", playerJson)
  });

  socket.on("give network", (networkPerson, person, indices, start, room, nodes, playerId) => {
    io.to(playerId).emit("join during game", networkPerson, person, indices, start, map.get(room).tab, nodes)
  })

  socket.on("join back game", (player) => {
    for (const k of map.keys()){
      const tab = map.get(k)
        for (let i = 0; i<tab.tab.length; i++){
          if (tab.tab[i].pseudo === player.pseudo && tab.tab[i].type !== "User"){
            if (tab.started){
              io.to(socket.id).emit("join back game", k)
            }
          }
        }
    }
  })

  socket.on("lobby joined", (room, player) =>{

    const game = map.get(room)
    if (game !== undefined){
      if (game.tab.length == 6 && !game.started){
        io.to(socket.id).emit("room full")
        return
      }
      if (game.started){
        for(const u of game.tab){
          if(u.type !== "User" && u.pseudo===player.pseudo){
            u.type = "User"
            u.id=socket.id
            io.to(game.tab[game.actualPlayer].id).emit("give network", socket.id)
            io.to(room).emit("player joined ingame", game.tab)
            socket.join(room)
            return
          }
        }
        io.to(socket.id).emit("game already started")
        return
      }
    }


    if (game == undefined){
      map.set(room, {tab: [{type: player.type, id: socket.id, pseudo: player.pseudo, profilePicture: player.profilePicture}], started: false, actualPlayer: 0, lastWorks: false})
      socket.join(room)
    }
    else{
      const tab = game.tab
      for(let i = 0; i<tab.length; i++){
        if (tab[i].id === socket.id && player.type==="User"){
          tab.splice(i, 1)
        }
      }

      if (player.type!=="User"){
        tab.push({type: player.type, id: player.id, pseudo: player.pseudo, profilePicture: player.profilePicture})
      }
      else{
        tab.push({type: player.type, id: socket.id, pseudo: player.pseudo, profilePicture: player.profilePicture})
        socket.join(room)
      }
    }
    
    io.to(room).emit("new player", map.get(room))
    const playerArray = Array.from(map.entries()).map(([key, value]) => ({ key, value }))
    const playerJson = JSON.stringify(playerArray);
    io.emit("request lobbies", playerJson)
    
  })

  socket.on("request lobbies", () => {
    const playerArray = Array.from(map.entries()).map(([key, value]) => ({ key, value }))
    const playerJson = JSON.stringify(playerArray);
    io.to(socket.id).emit("request lobbies", playerJson)
  })


  socket.on("bot deleted", (bot, room) =>{
    const tab = map.get(room).tab
    for(let i = 0; i<tab.length; i++){
      if (tab[i].id === bot.id){
        tab.splice(i, 1)
      }
    }
    io.to(room).emit("new player", map.get(room))
    const playerArray = Array.from(map.entries()).map(([key, value]) => ({ key, value }))
    const playerJson = JSON.stringify(playerArray);
    io.emit("request lobbies", playerJson)
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

  socket.on("who plays", (room) => {
    if (map.get(room) !== undefined){
      let player = map.get(room).actualPlayer
      if (map.get(room).tab[player].type != "User"){
        player = player + 1
        if (player == map.get(room).tab.length){
          player=0
        }
      }
      console.log(player)
      io.to(room).emit("who plays", player, map.get(room).lastWorks)
    }
  })

  socket.on("disconnect", () =>{
    for (const k of map.keys()){
      const tab = map.get(k)
        for (let i = 0; i<tab.tab.length; i++){
          if (tab.tab[i].id === socket.id){
            if (!tab.started){
              tab.tab.splice(i, 1)
              if (i==0){
                tab.tab.sort(comparePlayersByType).reverse()
              }
              io.to(k).emit("player left", tab, i)
            }
            else{
              tab.tab[i].type="EasyBot"
              io.to(k).emit("player left ingame", tab, i)
            }
            if (tab.tab.filter((p) => p.type=="User").length == 0){
              map.delete(k)
            }
          }
        }
    }
    const playerArray = Array.from(map.entries()).map(([key, value]) => ({ key, value }))
    const playerJson = JSON.stringify(playerArray);
    io.emit("request lobbies", playerJson)
  })


  socket.on("player quit", () => {
    lastSocketJoined=""
    for (const k of map.keys()){
      const tab = map.get(k)
        for (let i = 0; i<tab.tab.length; i++){
          if (tab.tab[i].id === socket.id){
            if (!tab.started){
              tab.tab.splice(i, 1)
              if (i==0){
                tab.tab.sort(comparePlayersByType).reverse()

              }
              io.to(k).emit("player left", tab, i)
            }
            else{
              tab.tab[i].type="EasyBot"
              io.to(k).emit("player left ingame", tab, i)
            }
            if (tab.tab.filter((p) => p.type=="User").length == 0){
              map.delete(k)
            }
          }
        }
    }
    const playerArray = Array.from(map.entries()).map(([key, value]) => ({ key, value }))
    const playerJson = JSON.stringify(playerArray);
    io.emit("request lobbies", playerJson)
  })

  socket.on("node checked", (id, works, color, room, playerIndex) =>{
    map.get(room).actualPlayer=playerIndex
    map.get(room).lastWorks=works
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

  socket.on("can't put square", (askingPlayer, room) => {
    io.to(room).emit("can't put square" , askingPlayer)
  })

  socket.on("opacity activated", (id) => {
    io.to(id).emit("opacity activated")
  })

  socket.on("opacity deactivated", (id) => {
    io.to(id).emit("opacity deactivated")
  })

  socket.on("reset graph", (id) => {
    io.to(id).emit("reset graph")
  })

  socket.on("end game", (winnerIndex, room) =>{
    io.to(room).emit("end game", winnerIndex)
    map.delete(room)
  })
});


function comparePlayersByType(a, b) {
  if (a.type < b.type) {
    return -1;
  } else if (a.type > b.type) {
    return 1;
  } else {
    return 0;
  }
}
