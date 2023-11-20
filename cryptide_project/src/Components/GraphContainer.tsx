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
  handleTurnBarTextChange: (newTurnBarText: string) => void
  changecptTour: (newcptTour : number) => void
  addToHistory: (message : string) => void
  solo : boolean
}

let lastAskingPlayer = 0
let lastNodeId = -1
let first = true
let askedWrong = false
let cptTour: number = 0

const MyGraphComponent: React.FC<MyGraphComponentProps> = ({onNodeClick, handleShowTurnBar, handleTurnBarTextChange, changecptTour, addToHistory, solo}) => {

  const { indices, indice, person, personNetwork, setNodeIdData, players, askedPersons, setActualPlayerIndexData, room, actualPlayerIndex, turnPlayerIndex, onlyFalse, setOnlyFalseData } = useGame();

  const params = new URLSearchParams(window.location.search);
  

  let firstlap = true;
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
    if (!solo){
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
      
      socket.on("node checked",(id, works, color, newPlayerIndex) => {
        const node = nodes.get().find((n) => id == n.id)
        if (node!=undefined){
          onNodeClick(false)
          playerIndex = newPlayerIndex
          if (!node.label.includes(colorToEmoji(color, works))){
            networkData.nodes.update({id: id, label: node.label + colorToEmoji(color, works)})
            addToHistory("qq1 à mis un " + colorToEmoji(color, works))
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
        setOnlyFalseData(true)
        askedWrong = true
        handleShowTurnBar(true)
        handleTurnBarTextChange("Mauvais choix, posez un carré !")
      })
  
  
      socket.on("asked", (nodeId, askingPlayer, askingPlayerIndex) => {
        console.log(askingPlayerIndex)
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
                  socket.emit("node checked", nodeId, true, positionToColor(thisPlayerIndex), room, playerIndex)
                }
                else{
                  maybe = maybe - 1
                  if(maybe == 0){
                    maybe = players.length - 1
                  }
                  socket.emit("node checked", nodeId, false, positionToColor(thisPlayerIndex), room, maybe)
                  socket.emit("asked wrong", askingPlayer, room)
                }
              }
            }     
          }
        }
        
      })
    }
    else {
      if (firstlap){
        addToHistory("<----- [Tour " + 1  +"/"+networkData.nodes.length + "] ----->");
        firstlap = false;
      }
    }
    



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
                socket.emit("node checked", params.nodes[0], false, positionToColor(thisPlayerIndex), room, playerIndex)
                askedPersons.push(person)
                askedWrong = false
              }
            }
          }
          else if (thisPlayerIndex == playerIndex){
            onNodeClick(true)
          }
          else{
            onNodeClick(false)
          }
        }
        else{ // si solo -> Mastermind
          const person = personNetwork?.getPersons().find((p) => p.getId() == params.nodes[0]) //person sélectionnée
          if (person != undefined){
            let index = 0;
            // indices.forEach(async (i, index) =>{
            for(const i of indices){
              const tester = IndiceTesterFactory.Create(i)
              const test = tester.Works(person)
              const node = nodes.get().find((n) => params.nodes[0] == n.id)
              if (node!=undefined){
                networkData.nodes.update({id: params.nodes[0], label: node.label + colorToEmoji(positionToColor(index), test)})
                await delay(500);
              }
              index ++;
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
      }
    });
  }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une fois après le premier rendu

  return (
    <>
      <div id="graph-container"/>
    </>
  );

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}



export default MyGraphComponent;