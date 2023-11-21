import React, { useEffect, useState } from "react";
import { DataSet, Network} from "vis-network/standalone/esm/vis-network";
import GraphCreator from "../model/Graph/GraphCreator";
import "./GraphContainer.css";
import IndiceTesterFactory from "../model/Factory/IndiceTesterFactory";
import Person from "../model/Person";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../Contexts/GameContext";
import { socket } from "../SocketConfig"
import { colorToEmoji, positionToColor } from "../ColorHelper";
import { ColorToHexa } from "../model/EnumExtender";
import Bot from "../model/Bot";
import NodePerson from "../model/Graph/NodePerson";


interface MyGraphComponentProps {
  onNodeClick: (shouldShowChoiceBar: boolean) => void;
  handleShowTurnBar: (shouldShowTurnBar: boolean) => void
  handleTurnBarTextChange: (newTurnBarText: string) => void
  setPlayerTouched: (newPlayerTouch: number) => void;
  playerTouched: number
  changecptTour: (newcptTour : number) => void
  addToHistory: (message : string) => void
  solo : boolean
  showLast: boolean
}

let lastAskingPlayer = 0
let lastNodeId = -1
let first = true
let askedWrong = false
let solo: boolean = true
let mapIndexPersons: Map<number, Person[]> = new Map<number, Person[]>()
let touchedPlayer = -1
let botIndex = -1
let askedWrongBot = false
let botTurnToCube = false
let lastSocketId= ""
let firstLap = true
let cptHistory = 0
let lastNodes: NodePerson[] = []


const MyGraphComponent: React.FC<MyGraphComponentProps> = ({onNodeClick, handleShowTurnBar, handleTurnBarTextChange, playerTouched, setPlayerTouched, changecptTour, solo, addToHistory, showLast}) => {
let cptTour: number = 0

  const { indices, indice, person, personNetwork, setNodeIdData, players, askedPersons, setActualPlayerIndexData, room, actualPlayerIndex, turnPlayerIndex, setTurnPlayerIndexData, setWinnerData } = useGame();
  const params = new URLSearchParams(window.location.search);

  const navigate = useNavigate();
  const [lastIndex, setLastIndex] = useState(-1)


  useEffect(() =>{
    touchedPlayer=playerTouched
    if (touchedPlayer == -1){
      if (!askedWrong){
        socket.emit("put correct background", socket.id)
      }
    }
    else if (touchedPlayer < players.length && touchedPlayer>=0){
      if(!askedWrong){
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
  let index = 0
  for (let i=0; i<players.length; i++){
    if(players[i].id == socket.id){
        index=i
        break
    }
  }
  let thisPlayerIndex = index

  useEffect(() =>{
    if (actualPlayerIndex==0){
      const bot = players[lastIndex]
      if(bot instanceof Bot && botIndex != lastIndex){
        botIndex = lastIndex
        if (personNetwork!=null){
          const [choosedPlayerIndex, personIndex] = bot.playRound(personNetwork, players)
          const person = personNetwork.getPersons().find((p) => p.getId() == personIndex)
          if (choosedPlayerIndex == players.length && person != undefined){
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
              socket.emit("asked all 1by1", person.getId(), players[playerIndex].id)
              if (i==players.length){
                socket.emit("node checked", personIndex, works, playerIndex, room, nextPlayerIndex)
              }
              else{
                socket.emit("node checked", personIndex, works, playerIndex, room, lastIndex)
              }
              if(!works){
                socket.emit("node checked", personIndex, works, playerIndex, room, nextPlayerIndex)
                const ind = bot.placeSquare(personNetwork, players)
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
              if (players[choosedPlayerIndex] instanceof Bot){
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
                  const ind = bot.placeSquare(personNetwork, players)
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
                socket.emit("ask player", personIndex, players[choosedPlayerIndex].id, players[lastIndex])
                console.log(lastIndex + " interroge " + +choosedPlayerIndex + " sur " + personNetwork.getPersons()[personIndex].getName())
                const tester = IndiceTesterFactory.Create(indices[choosedPlayerIndex])
                if (!tester.Works(person)){
                  const ind = bot.placeSquare(personNetwork, players)
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
      if (playerIndex == thisPlayerIndex){
        handleTurnBarTextChange("À vous de jouer")
        handleShowTurnBar(true)
      }
    }
  }

  useEffect(() => {
    if (personNetwork == null){
      return
    }
    const graph = GraphCreator.CreateGraph(personNetwork)

    const container = document.getElementById('graph-container');
    if (!container) {
      console.error("Container not found");
      return;
    }
    // Charger les données dans le graph
    const nodes = new DataSet(graph.nodesPerson);

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
            }
        }
    };

    const networkData = { nodes: nodes, edges: graph.edges };
    const network = new Network(container, networkData, initialOptions);

    if (!solo){
      socket.on("asked all", (id) =>{
        const pers = personNetwork.getPersons().find((p) => p.getId() == id)
        if (pers!=undefined){
          askedPersons.push(pers)
        }
      })

      socket.on("opacity activated", () => {
        nodes.forEach(node => {
          if (!lastNodes.find((n) => n.id == node.id)){
            networkData.nodes.update({id: node.id, opacity: 0.2})
          }
        });
      })

      socket.on("opacity deactivated", () => {
        nodes.forEach(node => {
          networkData.nodes.update({id: node.id, opacity: 1})
        });
      })

      socket.on("reset graph", () => {
        initialOptions.physics.enabled = true
        network.setOptions(initialOptions)
      })
      
      socket.on("node checked",(id, works, askedIndex, newPlayerIndex, socketId) => {
        const node = nodes.get().find((n) => id == n.id)
        if (node!=undefined){
          onNodeClick(false)
          playerIndex = newPlayerIndex
          if (mapIndexPersons.get(askedIndex)?.find((p) => p.getId() == id) == undefined){
            const p = personNetwork.getPersons().find((p)=> p.getId() == id)
            const tab = mapIndexPersons.get(askedIndex)
            if (p!=undefined && tab != undefined){
              tab.push(p)
              if (actualPlayerIndex == 0){
                players.forEach((player) => {
                  if (player instanceof Bot){
                    player.newInformation(p, askedIndex, works)
                  }
                })
              }
            } 
          }
          
          if (!node.label.includes(colorToEmoji(positionToColor(askedIndex), works))){
            networkData.nodes.update({id: id, label: node.label + colorToEmoji(positionToColor(askedIndex), works)})
            cptHistory++
            if (cptHistory % 2 == 0){
              lastNodes.push(node)
              addToHistory(players[askedIndex].name + " à mis un " + colorToEmoji(positionToColor(askedIndex), works) + " à " + personNetwork.getPersons()[id].getName())
            }
          }

          if (playerIndex === thisPlayerIndex){
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
        askedWrong = true
        askedWrongBot=true
        handleShowTurnBar(true)
        handleTurnBarTextChange("Mauvais choix, posez un carré !")
        socket.emit("put grey background", socket.id, thisPlayerIndex)
      })
  
  
      socket.on("asked", (nodeId, askingPlayer) => {
        if (askingPlayer.id !== lastAskingPlayer || nodeId !== lastNodeId ){
          lastAskingPlayer = askingPlayer.id
          lastNodeId = nodeId
          const pers = personNetwork.getPersons().find((p) => p.getId() == nodeId)
          if (pers!=undefined){
            if (askedPersons.includes(pers)){
              socket.emit("already asked", nodeId, askingPlayer, socket.id)
              return
            }
            else{
              askedPersons.push(pers)
              const node = nodes.get().find((n) => nodeId == n.id)
              if (node != undefined && indice != null){
                var tester = IndiceTesterFactory.Create(indice)
                let maybe = thisPlayerIndex
                if (tester.Works(pers)){
                  playerIndex = playerIndex + 1
                  if(playerIndex == players.length){
                    playerIndex = 0
                  }
                  socket.emit("node checked", nodeId, true, thisPlayerIndex, room, playerIndex)
                }
                else{
                  maybe = thisPlayerIndex - 1
                  if(maybe == 0){
                    maybe = players.length - 1
                  }
                  let index = players.findIndex((p) => p.id == askingPlayer.id)
                  if (players[index] instanceof Bot){
                    index = playerIndex + 1
                    if(index == players.length){
                      index = 0
                    }
                  }
                  if (index != undefined){
                    socket.emit("node checked", nodeId, false, thisPlayerIndex, room, index)
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
        addToHistory("<----- [Tour " + 1  +"/"+networkData.nodes.length + "] ----->");
      }
    }
    

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
          if (player != thisPlayerIndex){
            for(const person of personNetwork.getPersons().filter((p) => tab.includes(p))){
              networkData.nodes.update({id: person.getId(), color: "#808080"})
            }
          }
          else if(indice != null){
            const tester = IndiceTesterFactory.Create(indice)
            for(const person of personNetwork.getPersons().filter((p) => tab.includes(p) || tester.Works(p))){
              networkData.nodes.update({id: person.getId(), color: "#808080"})
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
          const node = nodes.get().find((n) => pers.getId() == n.id)
          if (node != undefined){
            for(let i=0; i<players.length; i++){
              if (node.label.includes(colorToEmoji(positionToColor(i), false)) || !tester.Works(pers)){
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
      setNodeIdData(-1)
      setActualPlayerIndexData(-1)
      setLastIndex(-1)
      setPlayerTouched(-1)
      setWinnerData(players[winnerIndex])
      navigate("/endgame")
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
          console.log(p)
        }
        
      });
      

      // Gérer le changement entre la physique et le déplacement manuel
      network.on("dragging", (params) => {
          if (params.nodes.length > 0) {
              // Un nœud a été cliqué
              initialOptions.physics.enabled = false;
              network.setOptions(initialOptions);
          }
      });

    network.on("click", async (params) => {
      
      if(params.nodes.length > 0){
        setNodeIdData(params.nodes[0])
        // addToHistory("Le joueur a cliqué") //! TEST DEBUG
        if (!solo){
          if (askedWrong){
            const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0])
            if (person !== undefined && indice !== null){
              const tester = IndiceTesterFactory.Create(indice)
              if (!tester.Works(person) && !askedPersons.includes(person)){
                playerIndex = thisPlayerIndex + 1
                if(playerIndex == players.length){
                  playerIndex = 0
                }
                socket.emit("node checked", params.nodes[0], false, thisPlayerIndex, room, playerIndex)
                socket.emit("put correct background", socket.id)
                touchedPlayer=-1
                askedPersons.push(person)
                askedWrong = false
              }
            }
          }
          else if(touchedPlayer != -1 && playerIndex == actualPlayerIndex && touchedPlayer<players.length){
            botIndex = -1
            if (players[touchedPlayer] instanceof Bot){
              const ind = indices[touchedPlayer]
              const test = IndiceTesterFactory.Create(ind)
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
              if (touchedPlayer > 0){
                console.log(touchedPlayer)
                socket.emit("ask player", params.nodes[0], players[touchedPlayer].id, players.find((p) => p.id === socket.id, actualPlayerIndex))
                socket.emit("put correct background", socket.id)
                touchedPlayer=-1
                setPlayerTouched(-1)
              }
            }
          }
          else if(playerIndex == actualPlayerIndex && touchedPlayer==players.length){
            botIndex = -1
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
          const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0]) //person sélectionnée
          if (person != undefined){
            let index =0
            let works = true
            for (const i of indices){
              const tester = IndiceTesterFactory.Create(i)
              const test = tester.Works(person)
              const node = nodes.get().find((n) => params.nodes[0] == n.id)
              if (node!=undefined){
                if (!node.label.includes(colorToEmoji(positionToColor(index), test))){
                  networkData.nodes.update({id: params.nodes[0], label: node.label + colorToEmoji(positionToColor(index), test)})
                  await delay(500)
                  if(!test){
                    works = false
                  }
                  if (index == indices.length - 1 && works){
                    navigate("/endgame")
                  }
                  
                }
              }
              index++
            }
            addToHistory(person.getName() + " n'est pas le tueur !"); //TODO préciser le nombre d'indice qu'il a de juste

            //TODO METTRE LA WIN CONDITION ICI AVEC LE MERGE
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