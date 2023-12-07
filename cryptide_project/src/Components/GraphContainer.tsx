import React, { useEffect, useState } from "react";
import { DataSet, Network} from "vis-network/standalone/esm/vis-network";
import GraphCreator from "../model/Graph/GraphCreator";
import "./GraphContainer.css";
import IndiceTesterFactory from "../model/Factory/IndiceTesterFactory";
import Person from "../model/Person";
import { useNavigate } from "react-router-dom";
import { useGame } from "../Contexts/GameContext";
import { socket } from "../SocketConfig"
import { colorToEmoji, positionToColor, positionToEmoji } from "../ColorHelper";
import { ColorToHexa } from "../model/EnumExtender";
import Bot from "../model/Bot";
import NodePerson from "../model/Graph/NodePerson";
import { useAuth } from "../Contexts/AuthContext";
import Indice from "../model/Indices/Indice";
import Pair from "../model/Pair";
import Player from "../model/Player";
import JSONParser from "../JSONParser";
import User from "../model/User";
import { json } from "body-parser";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {basePath} from "../AdressSetup"

interface MyGraphComponentProps {
  onNodeClick: (shouldShowChoiceBar: boolean) => void;
  handleShowTurnBar: (shouldShowTurnBar: boolean) => void
  handleTurnBarTextChange: (newTurnBarText: string) => void
  setPlayerTouched: (newPlayerTouch: number) => void;
  playerTouched: number
  changecptTour: (newcptTour : number) => void
  addToHistory: (message : string) => void
  solo : boolean
  isDaily : boolean
  isEasy: boolean
  setNetwork: (network: Network) => void
  showLast: boolean
  setNetworkEnigme: (networkEnigme: Map<number, Pair<Indice, boolean>[]>) => void
  askedWrong: boolean
  setAskedWrong: (askedWrong: boolean) => void
  setPlayerIndex: (playerIndex: number) => void
  importToPdf: boolean
  setImportToPdf: (imp: boolean) => void
  importToJSON: boolean
  setImportToJSON: (imp: boolean) => void
}

let lastAskingPlayer = 0
let lastNodeId = -1
let first = true
let askedWrongLocal = false
let mapIndexPersons: Map<number, Person[]> = new Map<number, Person[]>()
let touchedPlayer = -1
let botIndex = -1
let askedWrongBot = false
let lastSocketId= ""
let firstLap = true
let cptHistory = 0
let lastNodes: NodePerson[] = []
let cptEndgame = 0
let firstEnigme = true
let firstIndex = true
let endgame= false
let firstHistory = true
let cptSquare = 0
let cptOnAskedWrong = 0
let cptPlayerLeft = 0
let firstPlayer = 0
let cptBug = 0
let cptUseEffect = 0
let testPlayers: Player[] = []



const MyGraphComponent: React.FC<MyGraphComponentProps> = ({onNodeClick, handleShowTurnBar, handleTurnBarTextChange, playerTouched, setPlayerTouched, changecptTour, solo, isDaily, isEasy, addToHistory, showLast, setNetwork, setNetworkEnigme, setPlayerIndex, askedWrong, setAskedWrong, importToPdf, setImportToPdf, importToJSON, setImportToJSON}) => {
  let cptTour: number = 0

  //* Gestion du temps :
  let initMtn = 0

  const {isLoggedIn, user, manager} = useAuth();
  const { indices, indice, person, personNetwork, setNodeIdData, players, setPlayersData, askedPersons, setActualPlayerIndexData, room, actualPlayerIndex, turnPlayerIndex, setTurnPlayerIndexData, setWinnerData, dailyEnigme, setNbCoupData, settempsData, setNetworkDataData, setSeedData, nodesC} = useGame();
  const params = new URLSearchParams(window.location.search);

  const navigate = useNavigate();
  const [lastIndex, setLastIndex] = useState(-1)

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Démarrez le timer au montage du composant
    const intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 0.5);
      settempsData(elapsedTime)

      cptBug ++
      if (cptBug > 10){
        cptBug = 0
        socket.emit("who plays", room)
      }


      // Vérifiez si la durée est écoulée, puis arrêtez le timer
      if (endgame) {
        clearInterval(intervalId);
      }
    }, 500);

    // Nettoyez l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, [elapsedTime, endgame]);


  useEffect(() => {
    testPlayers = players
    console.log(testPlayers)
  }, [players])

  useEffect(() =>{
    touchedPlayer=playerTouched
    console.log(playerTouched)
    if (touchedPlayer == -1){
      if (!askedWrongLocal){
        socket.emit("put correct background", socket.id)
      }
    }
    else if (touchedPlayer < players.length && touchedPlayer>=0){
      if(!askedWrongLocal){
        socket.emit("put correct background", socket.id)
        socket.emit("put grey background", socket.id, touchedPlayer)
      }
    }
    else if(touchedPlayer == players.length){
      socket.emit("put imossible grey", socket.id)
    }
  }, [playerTouched])


  useEffect(() => {
    const tab: NodePerson[] = []
    for(const n of lastNodes.reverse()){
      //@ts-ignore
      if (!tab.find((node) => node.id == n.id)){
        tab.push(n)
        if (tab.length > players.length * 2) break
      }
    }
    lastNodes = tab
    if (showLast){
      socket.emit("opacity activated", socket.id)
    }
    else{
      socket.emit("opacity deactivated", socket.id)
    }
    
  }, [showLast])

  let playerIndex: number = turnPlayerIndex

  if (firstIndex){
    firstIndex=false
    setPlayerIndex(playerIndex)
  }
  let index = 0
  for (let i=0; i<players.length; i++){
    if(players[i].id == socket.id){
        index=i
        break
    }
  }

  useEffect(() =>{
    cptBug=0
    if (actualPlayerIndex==firstPlayer){
      const bot = testPlayers[lastIndex]
      if(bot instanceof Bot && botIndex != lastIndex){
        botIndex = lastIndex
        if (personNetwork!=null){
          const [choosedPlayerIndex, personIndex] = bot.playRound(personNetwork, players)
          //@ts-ignore
          const person = personNetwork.getPersons().find((p) => p.getId() == personIndex)
          if (choosedPlayerIndex == players.length && person != undefined){
            //@ts-ignore
            console.log(lastIndex + " All in sur => " + personNetwork.getPersons().find((p) => p.getId() == personIndex)?.getName())
            let nextPlayerIndex = lastIndex + 1
            if (nextPlayerIndex == players.length){
              nextPlayerIndex = 0
            }
            let playerIndex = lastIndex + 1
            let i = 0
            socket.emit("node checked", personIndex, true, lastIndex, room, lastIndex)
            while(playerIndex != lastIndex){
              i++
              if (playerIndex == players.length){
                playerIndex = 0
              }
              const tester = IndiceTesterFactory.Create(indices[playerIndex])
              const works = tester.Works(person)
              socket.emit("asked all 1by1", person.getId(), testPlayers[playerIndex].id)
              if (i==players.length){
                socket.emit("node checked", personIndex, works, playerIndex, room, nextPlayerIndex)
              }
              else{
                socket.emit("node checked", personIndex, works, playerIndex, room, lastIndex)
              }
              if(!works){
                socket.emit("node checked", personIndex, works, playerIndex, room, nextPlayerIndex)
                const ind = bot.placeSquare(personNetwork, testPlayers)
                if (ind == -1 ){
                  socket.emit("can't put square", lastIndex, room)
                  return
                }
                console.log(lastIndex + " pose carré sur " + personNetwork.getPersons()[ind].getName())
                playerIndex = lastIndex + 1
                if(playerIndex == players.length){
                  playerIndex = 0
                }
                socket.emit("node checked", ind, false, lastIndex, room, playerIndex)
                return
              }
              playerIndex ++
            }
            socket.emit("end game", lastIndex, room)
          }
          else{
            if (person!=undefined){
              if (testPlayers[choosedPlayerIndex] instanceof Bot){
                console.log("BOT")
                const tester = IndiceTesterFactory.Create(indices[choosedPlayerIndex])
                const works = tester.Works(person)
                if (works){
                  playerIndex = lastIndex + 1
                  if(playerIndex == players.length){
                    playerIndex = 0
                  }
                  console.log(lastIndex + " interroge " + choosedPlayerIndex + " a propos de " + person.getName() + " et dit oui")
                  socket.emit("node checked", personIndex, true, choosedPlayerIndex, room, playerIndex)
                }
                else{
                  console.log(lastIndex + " interroge " + choosedPlayerIndex + " a propos de " + person.getName() + " et dit non")
                  socket.emit("node checked", personIndex, false, choosedPlayerIndex, room, lastIndex)
                  const ind = bot.placeSquare(personNetwork, testPlayers)
                  if (ind == -1 ){
                    socket.emit("can't put square", playerIndex, room)
                    return
                  }
                  console.log(lastIndex + " pose carré sur " + personNetwork.getPersons()[ind].getName())
                  playerIndex = lastIndex + 1
                  if(playerIndex == players.length){
                    playerIndex = 0
                  }
                  socket.emit("node checked", ind, false, lastIndex, room, playerIndex)
                }
              }
              else{
                console.log(choosedPlayerIndex + " => Pas bot" )
                socket.emit("ask player", personIndex, testPlayers[choosedPlayerIndex].id, testPlayers[lastIndex])
                console.log(lastIndex + " interroge " + +choosedPlayerIndex + " sur " + personNetwork.getPersons()[personIndex].getName())
                const tester = IndiceTesterFactory.Create(indices[choosedPlayerIndex])
                if (!tester.Works(person)){
                  const ind = bot.placeSquare(personNetwork, testPlayers)
                  if (ind == -1 ){
                    socket.emit("can't put square", playerIndex, room)
                    return
                  }
                  console.log(lastIndex + " pose carré sur " + personNetwork.getPersons()[ind].getName())
                  playerIndex = lastIndex + 1
                  if(playerIndex == players.length){
                    playerIndex = 0
                  }
                  socket.emit("node checked", ind, false, lastIndex, room, playerIndex)
                }
              }
            }
          }
        }
      }
    }
  }, [lastIndex])


  
  if (first){
    first = false
    endgame= false
    if (!solo){
      for(let i = 0; i<indices.length; i++){
        mapIndexPersons.set(i, [])
      }
      if (actualPlayerIndex==0){
        players.forEach((p, index) =>{
          if (p instanceof Bot && personNetwork!=null){
            p.index=index
            p.initiateMap(personNetwork)
          }
        })
      }
      setActualPlayerIndexData(index)
      if (playerIndex == actualPlayerIndex){
        handleTurnBarTextChange("À vous de jouer")
        handleShowTurnBar(true)
      }
    }
  }

  useEffect(() => {
    if (importToPdf){
      setImportToPdf(false)
      const graphContainer = document.getElementById("graph-container");
      if (graphContainer == null){
        return
      }
      html2canvas(graphContainer).then((canvas) => {
        const pdf = new jsPDF({
          orientation: 'landscape', // Spécifie l'orientation du PDF en mode paysage
          unit: 'mm', // Unité de mesure (par exemple, millimètres)
          format: 'a4', // Format du papier (par exemple, a4)
        });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save('graph.pdf');
      });
    }
  }, [importToPdf])

  function downloadToJSON(jsonData: any, filename: string) {
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }


  useEffect(() => {
    if (importToJSON){
      setImportToJSON(false)
      downloadToJSON(personNetwork, "graph.json")
      downloadToJSON(JSON.stringify(indices), "indices.json")
    }
  }, [importToJSON])

  useEffect(() => {
    if (personNetwork == null){
      return
    }
    const graph = GraphCreator.CreateGraph(personNetwork)

    let n = graph.nodesPerson;
    let e = graph.edges;
    const graphState = { n, e };

    // Sauvegarder l'état dans localStorage
    localStorage.setItem('graphState', JSON.stringify(graphState));

    const container = document.getElementById('graph-container');
    if (!container) {
      console.error("Container not found");
      return;
    }
    // Charger les données dans le graph
    let nodes = new DataSet(graph.nodesPerson);
    if (nodesC.length != 0){
      nodes = new DataSet(nodesC)
    }

    // Configuration des options du Graphe
    const initialOptions = {

        layout: {
            improvedLayout: true,
            hierarchical: {
                enabled: false,
                direction: 'LR', // LR (Left to Right) ou autre selon votre préférence
                sortMethod: 'hubsize'
            },
            //randomSeed: 2
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -1000,
                springConstant: 0.001,
                springLength: 100
            },
            solver: "repulsion",
            repulsion: {
              nodeDistance: 100 // Put more distance between the nodes.
            }
        }
    };

    const networkData = { nodes: nodes, edges: graph.edges };
    const network = new Network(container, networkData, initialOptions);
    network.stabilize();
    setNetwork(network)
    setSeedData(network.getSeed())

    if (isDaily){
      setNetworkEnigme(dailyEnigme)
      if (!isEasy){
        dailyEnigme.forEach((pairs, index) => {
          pairs.forEach((pair) => {
            //@ts-ignore
            const i = indices.findIndex((indice) => pair.first.getId() === indice.getId())
            //@ts-ignore
            const node = networkData.nodes.get().find((n) => index == n.id)
            if (node != undefined){
              networkData.nodes.update({id: node.id, label: node.label + positionToEmoji(i, pair.second)})
            }
          })
        });
      }
      else{
        if (firstHistory){
          firstHistory=false
          indices.forEach((indice, index) => {
            addToHistory("Indice " + positionToEmoji(index, true) + " : " + indice.ToString("fr"))
          })
        }
        
      }
    }

    socket.on("give network", (playerId) => {
      socket.emit("give network", JSON.stringify(personNetwork, null, 2), JSON.stringify(person), JSON.stringify(indices), playerIndex, room, JSON.stringify(nodes.get()), playerId);
    })

    socket.on("player joined ingame", (tab) => {
      const tmpTab: Player[] = []
      let ind =0
      for (const p of tab){
        if (p.type === "User"){
          tmpTab.push(JSONParser.JSONToPlayer(p))
        }
        else{
          tmpTab.push(testPlayers[ind])
        }
        ind ++
      }
      setPlayersData(tmpTab)
    })

    socket.on("player left ingame", (tab, i) => {
      cptPlayerLeft ++
      if (cptPlayerLeft % 2 == 0){
        const tmpTab: Player[] = []
        let ind =0
        for (const p of tab.tab){
          if (ind === i || p.type === "User"){
            tmpTab.push(JSONParser.JSONToPlayer(p))
          }
          else{
            tmpTab.push(testPlayers[ind])
          }
          ind ++
        }
        if (i==firstPlayer){
          for(let index = 0; index < tmpTab.length; index++){
            const test = tmpTab[index]
            if (test instanceof User){
              firstPlayer=index
              break
            }
          }
          if (actualPlayerIndex==firstPlayer){
            tmpTab.forEach((p, index) =>{
              if (p instanceof Bot && personNetwork!=null){
                p.indice=indices[index]
                p.index=index
                p.initiateMap(personNetwork)
                console.log(p.indice.ToString("fr"))
              }
            })
          }
        }
        else{
          const bot = tmpTab[i]
          if (bot instanceof Bot && personNetwork != null){
            bot.indice=indices[i]
            bot.index=index
            bot.initiateMap(personNetwork)
            console.log(bot.indice.ToString("fr"))
          }
        }
        if (i==playerIndex){
          playerIndex = lastIndex + 1
          if(playerIndex == players.length){
            playerIndex = 0
          }
          setPlayerIndex(playerIndex)
          setLastIndex(playerIndex)
          if (playerIndex===actualPlayerIndex){
            handleTurnBarTextChange("À vous de jouer")
            handleShowTurnBar(true)
          }
        }
        setPlayersData(tmpTab)
      }
  })

    socket.on("reset graph", () => {
      console.log("reset graph")
      initialOptions.physics.enabled = true
      network.setOptions(initialOptions)
    })

    if (!solo){

      socket.on("who plays", (index) => {
        playerIndex=index
        setPlayerIndex(index)
        setLastIndex(index)
        if (actualPlayerIndex==index){
          handleShowTurnBar(true)
        }
      })

      socket.on("asked all", (id) =>{
        //@ts-ignore
        const pers = personNetwork.getPersons().find((p) => p.getId() == id)
        if (pers!=undefined){
          askedPersons.push(pers)
        }
      })

      socket.on("opacity activated", () => {
        //@ts-ignore
        nodes.forEach(node => {
          //@ts-ignore
          if (!lastNodes.find((n) => n.id == node.id)){
            networkData.nodes.update({id: node.id, opacity: 0.2})
          }
        });
      })

      socket.on("opacity deactivated", () => {
        //@ts-ignore
        nodes.forEach(node => {
          networkData.nodes.update({id: node.id, opacity: 1})
        });
      })
      
      socket.on("node checked",(id, works, askedIndex, newPlayerIndex, socketId) => {
        cptBug=0
        //@ts-ignore
        const node = nodes.get().find((n) => id == n.id)
        if (node!=undefined){
          onNodeClick(false)
          playerIndex = newPlayerIndex
          setPlayerIndex(playerIndex)
          setLastIndex(newPlayerIndex)
          console.log(newPlayerIndex)
          //@ts-ignore
          if (mapIndexPersons.get(askedIndex)?.find((p) => p.getId() == id) == undefined){
            //@ts-ignore
            const p = personNetwork.getPersons().find((p)=> p.getId() == id)
            const tab = mapIndexPersons.get(askedIndex)
            if (p!=undefined && tab != undefined){
              tab.push(p)
              if (actualPlayerIndex == 0){
                testPlayers.forEach((player) => {
                  if (player instanceof Bot){
                    player.newInformation(p, askedIndex, works)
                  }
                })
              }
            } 
          }
          
          if (!node.label.includes(colorToEmoji(positionToColor(askedIndex), works))){
            networkData.nodes.update({id: id, label: node.label + positionToEmoji(askedIndex, works)})
            cptHistory++
            if (cptHistory % 2 == 0){
              lastNodes.push(node)
              addToHistory(testPlayers[askedIndex].pseudo + " à mis un " + positionToEmoji(askedIndex, works) + " à " + personNetwork.getPersons()[id].getName())
            }
          }

          if (playerIndex === actualPlayerIndex){
            handleTurnBarTextChange("À vous de jouer")
            handleShowTurnBar(true)
          }
          else{
            handleShowTurnBar(false)
          }
        }
        lastSocketId = socketId
        lastAskingPlayer = 0
        lastNodeId = -1
        setLastIndex(newPlayerIndex)
      })
  
      socket.on("already asked", (nodeId, askedPlayer) =>{
        console.log("player: " + askedPlayer + " already asked on node " + nodeId)
      })
  
      socket.on("asked wrong", () =>{
        cptSquare++
        if (cptSquare % 2 == 0){
          if (indice==null){
            return
          }
          const tester = IndiceTesterFactory.Create(indice)
          const tabPossible: Person[] = []
          for(const person of personNetwork.getPersons()){
            //@ts-ignore
            const node = nodes.get().find((n) => n.id == person.getId())
            if (node != undefined) {
              let isSquare = false
              players.forEach((p, index) => {
                if (node.label.includes(positionToEmoji(index, false))){
                  isSquare=true
                }
              })
              if (!tester.Works(person) && !isSquare){
                tabPossible.push(person)
              }
            }
          }
          if (tabPossible.length>0){
            askedWrongLocal= true
            setAskedWrong(true)
            askedWrongBot=true
            handleShowTurnBar(true)
            handleTurnBarTextChange("Mauvais choix, posez un carré !")
            socket.emit("put grey background", socket.id, actualPlayerIndex)
          }
          else{
            socket.emit("can't put square", actualPlayerIndex, room)
          }
        }
      })

      socket.on("can't put square", (askingPlayer) => {
        cptBug=0
        cptOnAskedWrong ++
        if (cptOnAskedWrong % 2 == 0){
          addToHistory(testPlayers[askingPlayer].pseudo + " ne peut plus poser de carré")
          playerIndex = askingPlayer + 1
          if(playerIndex == players.length){
            playerIndex = 0
          }
          setPlayerIndex(playerIndex)
          setLastIndex(playerIndex)
          if (playerIndex === actualPlayerIndex){
            handleTurnBarTextChange("À vous de jouer")
            handleShowTurnBar(true)
          }
          else{
            handleShowTurnBar(false)
            socket.emit("put correct background", socket.id)
          }
        }
      })
  
  
      socket.on("asked", (nodeId, askingPlayer) => {
        
        if (askingPlayer.id !== lastAskingPlayer || nodeId !== lastNodeId ){
          lastAskingPlayer = askingPlayer.id
          lastNodeId = nodeId
          //@ts-ignore
          const pers = personNetwork.getPersons().find((p) => p.getId() == nodeId)
          if (pers!=undefined){
            if (askedPersons.includes(pers)){
              socket.emit("already asked", nodeId, askingPlayer, socket.id)
              return
            }
            else{
              askedPersons.push(pers)
              //@ts-ignore
              const node = nodes.get().find((n) => nodeId == n.id)
              if (node != undefined && indice != null){
                var tester = IndiceTesterFactory.Create(indice)
                if (tester.Works(pers)){
                  playerIndex = playerIndex + 1
                  if(playerIndex == players.length){
                    playerIndex = 0
                  }
                  socket.emit("node checked", nodeId, true, actualPlayerIndex, room, playerIndex)
                }
                else{
                  let index = testPlayers.findIndex((p) => p.id == askingPlayer.id)
                  if (testPlayers[index] instanceof Bot){
                    index = playerIndex + 1
                    if(index == players.length){
                      index = 0
                    }
                  }
                  if (index != undefined){
                    socket.emit("node checked", nodeId, false, actualPlayerIndex, room, index)
                    socket.emit("asked wrong", askingPlayer, room)
                  }
                }
              }
            }     
          }
        }
        
      })
    }
    else {
      if (firstLap){
        firstLap=false
        if (!isDaily){
          addToHistory("<----- [Tour " + 1  +"/"+networkData.nodes.length + "] ----->");
        }
      }
    }


    const putCorrectBackground = () => {
      if (personNetwork != null){
        for(const person of personNetwork.getPersons()){
          networkData.nodes.update({id: person.getId(), color: ColorToHexa(person.getColor())})
        }
      }
    };

/*
    const putGreyBackgroud = () => {
      if (stepTuto === 3){
        const tabGrey = [0, 1, 2, 3, 5, 6, 7, 8, 9]
        for (const i of tabGrey){
          nodes.update({id: i, color: "#808080"})
        }
        console.log("CA MARCHE")
      }
    };
*/
    

    //setGreyForEveryone(() => myFunctionInsideEffect);
    

    socket.on("put correct background", () =>{
      if (personNetwork != null){
        for(const person of personNetwork.getPersons()){
          networkData.nodes.update({id: person.getId(), color: ColorToHexa(person.getColor())})
        }
      }
    })

    socket.on("put grey background", (player) =>{
      if (personNetwork != null){
        const tab = mapIndexPersons.get(player)
        if (tab != undefined){
          if (player != actualPlayerIndex){
            for(const person of personNetwork.getPersons().filter((p) => tab.includes(p))){
              networkData.nodes.update({id: person.getId(), color: "#808080"})
            }
          }
          else if(indice != null){
            //Pour poser un carré
            const tester = IndiceTesterFactory.Create(indice)
            for(const person of personNetwork.getPersons()){
              //@ts-ignore
              const node = nodes.get().find((n) => n.id == person.getId())
              if (node == undefined) continue
              let isSquare = false
              players.forEach((p, index) => {
                if (node.label.includes(positionToEmoji(index, false))){
                  isSquare=true
                }
              })
              if (tab.includes(person) || tester.Works(person) || isSquare){
                networkData.nodes.update({id: person.getId(), color: "#808080"})
              }
            }
          }
        }
      }
    })

    socket.on("put imossible grey", ()=>{
      if (personNetwork != null && indice!=null){
        const tabNodes: any = []
        const tester = IndiceTesterFactory.Create(indice)
        for (const pers of personNetwork.getPersons()){
          //@ts-ignore
          const node = nodes.get().find((n) => pers.getId() == n.id)
          if (node != undefined){
            for(let i=0; i<players.length; i++){
              if (node.label.includes(positionToEmoji(i, false)) || !tester.Works(pers)){
                tabNodes.push(node)
                break
              }
            }
          }
          
        }
        for(const n of tabNodes){
          networkData.nodes.update({id: n.id, color: "#808080"})
        }
      }
    })

    socket.on("end game", (winnerIndex) =>{
      if (cptEndgame % 2 == 0){
        cptEndgame++;
        const currentPlayer = players[actualPlayerIndex];
        const winner = players[winnerIndex];
  
        setNetworkDataData(networkData)
        setNodeIdData(-1)
        setActualPlayerIndexData(-1)
        setLastIndex(-1)
        setPlayerTouched(-1)
        setWinnerData(winner)
        setElapsedTime(0)

        first = true
        cptHistory = 0
        askedWrongLocal=false
        setAskedWrong(false)
        askedWrongBot=false
        endgame = true
        firstHistory=true
        cptBug=0
        try{
          if(isLoggedIn){
            if(!solo){
              if(user && user.onlineStats){
                // console.log("nbGames: " + user.onlineStats.nbGames + " nbWins: " + user.onlineStats.nbWins);
                if(winner.id === currentPlayer.id){
                  // Ajouter une victoire
                  manager.userService.addOnlineStats(user.pseudo, 1, elapsedTime);
                }
                else{
                  manager.userService.addOnlineStats(user.pseudo, 0, elapsedTime);
                }
              }
              else{
                console.error("User not found");
              }
            }
          }
        }
        catch(e){
          console.log(e);
        }
        finally{
          socket.off("end game")
          socket.off("asked all")
          socket.off("opacity activated")
          socket.off("opacity deactivated")
          socket.off("reset graph")
          socket.off("node checked")
          socket.off("already asked")
          socket.off("asked wrong")
          socket.off("asked")
          socket.off("put correct background")
          socket.off("put grey background")
          socket.off("put imossible grey")
          socket.off("who plays")
    
          navigate(`${basePath}/endgame`)
        }        
      }
    })



      personNetwork.getPersons().forEach(p => {
        let a = 0
        for (let i of indices){
          let tester = IndiceTesterFactory.Create(i)
          if (tester.Works(p)){
            a++
          }
        }
        if (a==indices.length){
          //networkData.nodes.update({id: p.getId(), label: p.getName() + "\n🔵"})
          //console.log(p)
        }
        
      });
      

      // Gérer le changement entre la physique et le déplacement manuel
      network.on("dragging", (params) => {
          if (params.nodes.length > 0) {
              // Un nœud a été cliqué
              initialOptions.physics.enabled = false;
              network.setOptions(initialOptions);
              setNetwork(network)
          }
      });

    network.on("click", async (params) => {
      
      if(params.nodes.length > 0){
        console.log(touchedPlayer)
        setNodeIdData(params.nodes[0])
        console.log(players)
        // addToHistory("Le joueur a cliqué") //! TEST DEBUG
        if (!solo){
          if (askedWrongLocal){
            const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0])
            //@ts-ignore
            const node = nodes.get().find((n) => n.id == params.nodes[0])
            if (person !== undefined && indice !== null && node!=undefined){
              const tester = IndiceTesterFactory.Create(indice)
              let isSquare = false
              players.forEach((p, index) => {
                if (node.label.includes(positionToEmoji(index, false))){
                  isSquare=true
                }
              })
              if (!tester.Works(person) && !askedPersons.includes(person) && !isSquare){
                playerIndex = actualPlayerIndex + 1
                if(playerIndex == players.length){
                  playerIndex = 0
                }
                socket.emit("node checked", params.nodes[0], false, actualPlayerIndex, room, playerIndex)
                socket.emit("put correct background", socket.id)
                touchedPlayer=-1
                askedPersons.push(person)
                askedWrongLocal=false
                setAskedWrong(false)
              }
            }
          }
          else if(touchedPlayer != -1 && playerIndex == actualPlayerIndex && touchedPlayer<players.length){
            botIndex = -1
            console.log(testPlayers[touchedPlayer])
            if (testPlayers[touchedPlayer] instanceof Bot){
              console.log("BOT TOUCHÉ")
              const ind = indices[touchedPlayer]
              const test = IndiceTesterFactory.Create(ind)
              //@ts-ignore
              const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0])
              if (person != undefined){
                if (test.Works(person)){
                  let nextPlayerIndex = actualPlayerIndex + 1
                  if (nextPlayerIndex == players.length){
                    nextPlayerIndex = 0
                  }
                  socket.emit("node checked", params.nodes[0], true, touchedPlayer, room, nextPlayerIndex)
                  setPlayerTouched(-1)
                }
                else{
                  socket.emit("node checked", params.nodes[0], false, touchedPlayer, room, actualPlayerIndex)
                  socket.emit("asked wrong", players[actualPlayerIndex])
                  setPlayerTouched(-1)
                }
              }
            }
            else{
              if (touchedPlayer >= 0){
                console.log("CE N'EST PAS UN BOT")
                //@ts-ignore
                socket.emit("ask player", params.nodes[0], players[touchedPlayer].id, players.find((p) => p.id === socket.id, actualPlayerIndex))
                socket.emit("put correct background", socket.id)
                touchedPlayer=-1
                setPlayerTouched(-1)
              }
            }
          }
          else if(playerIndex == actualPlayerIndex && touchedPlayer==players.length){
            botIndex = -1
            //@ts-ignore
            const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0])
            if (person != undefined){
              const indiceTester = IndiceTesterFactory.Create(indices[actualPlayerIndex])
              let nextPlayerIndex = actualPlayerIndex + 1
              if (nextPlayerIndex == players.length){
                nextPlayerIndex = 0
              }
      
              let playerIndex = actualPlayerIndex + 1
              if (indiceTester.Works(person)){
                let i = 0
                socket.emit("node checked", params.nodes[0], true, actualPlayerIndex, room, actualPlayerIndex)
                while(playerIndex != actualPlayerIndex){
                  if (playerIndex == players.length){
                    playerIndex = 0
                  }
                  const tester = IndiceTesterFactory.Create(indices[playerIndex])
                  const works = tester.Works(person)
                  await delay(500);
                  socket.emit("asked all 1by1", person.getId(), players[playerIndex].id)
                  if (works){
                    socket.emit("node checked", params.nodes[0], true, playerIndex, room, actualPlayerIndex)
                  }
                  if(!works){
                    socket.emit("node checked", params.nodes[0], works, playerIndex, room, actualPlayerIndex)
                    socket.emit("put correct background", socket.id)
                    socket.emit("asked wrong", players[actualPlayerIndex])
                    touchedPlayer=-1
                    setPlayerTouched(-1)
                    return
                  }
                  if (i == players.length - 1){
                    socket.emit("put correct background", socket.id)
                    await delay(1000)
                    socket.emit("end game", actualPlayerIndex, room)
                    return
                  }
                  playerIndex ++
                  i++
                }
                touchedPlayer=-1
                setPlayerTouched(-1)
                socket.emit("put correct background", socket.id)
                await delay(1000)
                socket.emit("end game", actualPlayerIndex, room)
              }
            }
          }
        } 
        else{
          //@ts-ignore
          const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0]) //person sélectionnée
          if (person != undefined){
            let index =0
            let works = true
            for (const i of indices){
              const tester = IndiceTesterFactory.Create(i)
              const test = tester.Works(person)
              //@ts-ignore
              const node = nodes.get().find((n) => params.nodes[0] == n.id)
              if (node!=undefined){
                if (!node.label.includes(positionToEmoji(index, test))){
                  networkData.nodes.update({id: params.nodes[0], label: node.label + positionToEmoji(index, test)})
                  await delay(500)
                  if(!test){
                    works = false
                  }
                  if (index == indices.length - 1 && works){

                    if (user!=null){
                      setWinnerData(user)
                      setNetworkDataData(networkData)
                    }
                    cptTour ++;
                    setNbCoupData(cptTour)
                    setElapsedTime(0)
                    endgame = true

                    try{
                      if(user && isLoggedIn){
                        if(solo){
                          if(isDaily){
                            // TODO: verif difficulté et add les stats
                            // TODO: verif pour facile et difficile, si réussi en one shot ou non
                            if(isEasy){
                              manager.userService.addEasyEnigmaStats(user.pseudo, 1, elapsedTime);
                            }
                            else{
                              manager.userService.addHardEnigmaStats(user.pseudo, 1, elapsedTime);
                            }
                          }
                          else{
                            // add stats mastermind
                            if(user && user.mastermindStats){
                              manager.userService.addMastermindStats(user.pseudo, cptTour, elapsedTime);
                            }
                          }
                        }
                      }
                    }
                    catch(error){
                      console.log(error);
                    }
                    navigate(`${basePath}/endgame?solo=true&daily=${isDaily}`)
                  }
                  
                }
              }
              index++
            }
            addToHistory(person.getName() + " n'est pas le coupable !"); //TODO préciser le nombre d'indice qu'il a de juste

            cptTour ++; // On Incrémente le nombre de tour du joueur
            const tour = cptTour+1;
            addToHistory("<----- [Tour " + tour  +"/"+networkData.nodes.length + "] ----->");
            changecptTour(cptTour); // On le transmet a la page précédente avec la fonction
          }
        }
      }
        // Renvoyer un true pour afficher la choice bar
      else{
        // Renvoyer un false pour cacher la choice bar
        onNodeClick(false)
        setPlayerTouched(-1)
      }
    });
  }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une fois après le premier rendu

  return (
    <>
      <div id="graph-container"/>
    </>
  );

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function putGreyBackgroud(index: number){
    /*
    
    */
  }
}



export default MyGraphComponent;