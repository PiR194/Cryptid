import React, { useEffect, useState } from "react";
import { DataSet, Network} from "vis-network/standalone/esm/vis-network";
import EdgesCreator from "../model/EdgesCreator";
import GraphCreator from "../model/Graph/GraphCreator";
import IndiceChooser from "../model/IndiceChooser";
import SportIndice from "../model/Indices/SportIndice";
import NetworkGenerator from "../model/NetworkGenerator";
import Sport from "../model/Sport";
import Stub from "../model/Stub";
import "./GraphContainer.css";
import NodePerson from "../model/Graph/NodePerson";
import IndiceTesterFactory from "../model/Factory/IndiceTesterFactory";
import GameCreator from "../model/GameCreator";
import io from 'socket.io-client';
import JSONParser from "../JSONParser";
import PersonNetwork from "../model/PersonsNetwork";
import Person from "../model/Person";
import Indice from "../model/Indices/Indice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../Contexts/GameContext";
import { socket } from "../SocketConfig"
import { colorToEmoji, positionToColor } from "../ColorHelper";
import { ColorToHexa } from "../model/EnumExtender";


interface MyGraphComponentProps {
  onNodeClick: (shouldShowChoiceBar: boolean) => void;
  handleShowTurnBar: (shouldShowTurnBar: boolean) => void
  handleTurnBarTextChange: (newTurnBarText: string) => void
  setPlayerTouched: (newPlayerTouch: number) => void;
  playerTouched: number
}

let lastAskingPlayer = 0
let lastNodeId = -1
let first = true
let askedWrong = false
let solo: boolean = true
let mapIndexPersons: Map<number, Person[]> = new Map<number, Person[]>()
let touchedPlayer = -1


const MyGraphComponent: React.FC<MyGraphComponentProps> = ({onNodeClick, handleShowTurnBar, handleTurnBarTextChange, playerTouched, setPlayerTouched}) => {

  const { indices, indice, person, personNetwork, setNodeIdData, players, askedPersons, setActualPlayerIndexData, room, actualPlayerIndex, turnPlayerIndex, setWinnerData } = useGame();
  const params = new URLSearchParams(window.location.search);
  const solotmp = params.get('solo');
  const navigate = useNavigate();

  console.log(person)

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
  

  let playerIndex: number = turnPlayerIndex
  let index = 0
  for (let i=0; i<players.length; i++){
    if(players[i].id == socket.id){
        index=i
        break
    }
  }
  let thisPlayerIndex = index
  

  if (first){
    first = false
    if (solotmp == "false"){
      solo=false
    }
    if (!solo){
      for(let i = 0; i<indices.length; i++){
        mapIndexPersons.set(i, [])
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
            }
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
      
      socket.on("node checked",(id, works, askedIndex, newPlayerIndex) => {
        const node = nodes.get().find((n) => id == n.id)
        if (node!=undefined){
          onNodeClick(false)
          playerIndex = newPlayerIndex
          if (mapIndexPersons.get(askedIndex)?.find((p) => p.getId() == id) == undefined){
            const p = personNetwork.getPersons().find((p)=> p.getId() == id)
            const tab = mapIndexPersons.get(askedIndex)
            if (p!=undefined && tab != undefined){
              tab.push(p)
            } 
          }
          
          if (!node.label.includes(colorToEmoji(positionToColor(askedIndex), works))){
            networkData.nodes.update({id: id, label: node.label + colorToEmoji(positionToColor(askedIndex), works)})
          }
          
          if (playerIndex === thisPlayerIndex){
            handleTurnBarTextChange("À vous de jouer")
            handleShowTurnBar(true)
          }
          else{
            handleShowTurnBar(false)
          }
        }
        lastAskingPlayer = 0
        lastNodeId = -1
      })
  
      socket.on("already asked", (nodeId, askedPlayer) =>{
        console.log("player: " + askedPlayer + " already asked on node " + nodeId)
      })
  
      socket.on("asked wrong", () =>{
        askedWrong = true
        handleShowTurnBar(true)
        handleTurnBarTextChange("Mauvais choix, posez un carré !")
        socket.emit("put grey background", socket.id, thisPlayerIndex)
      })
  
  
      socket.on("asked", (nodeId, askingPlayer, askingPlayerIndex) => {
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
                playerIndex = playerIndex + 1
                if(playerIndex == players.length){
                  playerIndex = 0
                }
                if (tester.Works(pers)){
                  socket.emit("node checked", nodeId, true, thisPlayerIndex, room, playerIndex)
                }
                else{
                  maybe = maybe - 1
                  if(maybe == 0){
                    maybe = players.length - 1
                  }
                  socket.emit("node checked", nodeId, false, thisPlayerIndex, room, maybe)
                  socket.emit("asked wrong", askingPlayer, room)
                }
              }
            }     
          }
        }
        
      })
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
                console.log(tester.Works(pers))
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
          else if(touchedPlayer != - 1 && playerIndex == actualPlayerIndex && touchedPlayer<players.length){
            socket.emit("ask player", params.nodes[0], players[touchedPlayer].id, players.find((p) => p.id === socket.id, actualPlayerIndex))
            socket.emit("put correct background", socket.id)
            touchedPlayer=-1
          }
          else if(playerIndex == actualPlayerIndex && touchedPlayer==players.length){
            const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0])
            if (person != undefined){
              const indiceTester = IndiceTesterFactory.Create(indices[actualPlayerIndex])
              let nextPlayerIndex = actualPlayerIndex + 1
              if (nextPlayerIndex == players.length){
                nextPlayerIndex = 0
              }
      
              let playerIndex = actualPlayerIndex + 1
              if (indiceTester.Works(person)){
                socket.emit("node checked", params.nodes[0], true, actualPlayerIndex, room, nextPlayerIndex)
                while(playerIndex != actualPlayerIndex){
                  if (playerIndex == players.length){
                    playerIndex = 0
                  }
                  const tester = IndiceTesterFactory.Create(indices[playerIndex])
                  const works = tester.Works(person)
                  await delay(500);
                  socket.emit("asked all 1by1", person.getId(), players[playerIndex].id)
                  socket.emit("node checked", params.nodes[0], works, playerIndex, room, nextPlayerIndex)
                  if(!works){
                    socket.emit("put correct background", socket.id)
                    touchedPlayer=-1
                    return
                  }
                  playerIndex ++
                }
                touchedPlayer=-1
                socket.emit("put correct background", socket.id)
                await delay(1000)
                socket.emit("end game", thisPlayerIndex, room)
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