import React, { useEffect } from "react";
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
import { useLocation } from "react-router-dom";
import { useGame } from "../Contexts/GameContext";
import { socket } from "../SocketConfig"
import { colorToEmoji, positionToColor } from "../ColorHelper";


interface MyGraphComponentProps {
  onNodeClick: (shouldShowChoiceBar: boolean) => void;
  handleShowTurnBar: (shouldShowTurnBar: boolean) => void
}

let lastAskingPlayer = 0
let lastNodeId = -1
let first = true

const MyGraphComponent: React.FC<MyGraphComponentProps> = ({onNodeClick, handleShowTurnBar}) => {

  const { indices, indice, person, personNetwork, setNodeIdData, players, askedPersons, setActualPlayerIndexData, room, actualPlayerIndex } = useGame();

  let playerIndex: number = actualPlayerIndex
  let index = 0
  for (let i=0; i<players.length; i++){
    if(players[i].id == socket.id){
        index=i
        break
    }
  }
  let thisPlayerIndex = index
  if (playerIndex == thisPlayerIndex){
    handleShowTurnBar(true)
  }

  if (first){
    first = false
    console.log(indice)

    indices.forEach(i => {
      console.log(i.ToString("en"))
    });
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

    
    
    socket.on("node checked",(id, works, color, newPlayerIndex) => {
      const node = nodes.get().find((n) => id == n.id)
      if (node!=undefined){
        onNodeClick(false)
        playerIndex = newPlayerIndex
        networkData.nodes.update({id: id, label: node.label + colorToEmoji(color, works)})
        if (playerIndex == thisPlayerIndex){
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
              playerIndex = playerIndex + 1
              if(playerIndex == players.length){
                playerIndex = 0
              }
              if (tester.Works(pers)){
                socket.emit("node checked", nodeId, true, positionToColor(thisPlayerIndex), room, playerIndex)
              }
              else{
                socket.emit("node checked", nodeId, false, positionToColor(thisPlayerIndex), room, playerIndex)
              }
            }
          }     
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

    network.on("click", (params) => {
      
      if(params.nodes.length > 0){
        setNodeIdData(params.nodes[0])

        // Renvoyer un true pour afficher la choice bar
        if (thisPlayerIndex == playerIndex){
          onNodeClick(true)
        }
        else{
          onNodeClick(false)
        }
      }
      else{
        // Renvoyer un false pour cacher la choice bar
        onNodeClick(false)
      }
    });
  }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une fois après le premier rendu

  return (
    <>
      <div id="graph-container"/>
    </>
  );
}



export default MyGraphComponent;