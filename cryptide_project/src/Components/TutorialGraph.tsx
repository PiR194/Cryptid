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
import PersonNetwork from "../model/PersonsNetwork";

interface TutorialGraphProps {
  setNetwork: (network: Network) => void
  showLast: boolean
  setPlayerIndex: (playerIndex: number) => void
  handleShowTurnBar: (bool: boolean) => void
  handleTurnBarTextChange: (text: string) => void
  addToHistory: (text: string) => void
  setPlayerTouched: (playerIndex: number) => void
  playerTouched: number
  tutoStep: number
  setTutoStep: (step: number) => void
  setGreyForEveryone: (func: () => void) => void
}

let lastNodes: NodePerson[] = []
let firstIndex = true
let first = true
let touchedPlayer = -1
let stepTuto = -1




const TutorialGraph: React.FC<TutorialGraphProps> = ({showLast, setNetwork, setPlayerIndex, handleShowTurnBar, handleTurnBarTextChange, addToHistory, setPlayerTouched, playerTouched, tutoStep, setTutoStep, setGreyForEveryone}) => {
  let cptTour: number = 0

  //* Gestion du temps :
  let initMtn = 0

  const {isLoggedIn, user, manager} = useAuth();
  const {setIndiceData, setIndicesData, setActualPlayerIndexData, setWinnerData, setPlayersData, setNetworkDataData, setPersonData} = useGame();
  const params = new URLSearchParams(window.location.search);

  const navigate = useNavigate();
  const [lastIndex, setLastIndex] = useState(-1)

  if (first){
    first = false
    setActualPlayerIndexData(0)
    handleTurnBarTextChange("C'est à vous de jouer !")
    handleShowTurnBar(true)
  }
  

  useEffect(() =>{
    touchedPlayer=playerTouched
  }, [playerTouched])

  useEffect(() => {
    stepTuto = tutoStep
    if(stepTuto===1){
      handleShowTurnBar(true)
    }
  }, [tutoStep])


  useEffect(() => {
    const tab: NodePerson[] = []
    for(const n of lastNodes.reverse()){
    
    }
    lastNodes = tab
    if (showLast){
      socket.emit("opacity activated", socket.id)
    }
    else{
      socket.emit("opacity deactivated", socket.id)
    }
    
  }, [showLast])

  let playerIndex: number = 0

  if (firstIndex){
    firstIndex=false
    setPlayerIndex(playerIndex)
  }
  let index = 0

  useEffect(() => {


    let jsonGraph = require("../tuto/graph.json")
    let jsonIndice = require("../tuto/indices.json")

    const personNetwork = JSONParser.JSONToNetwork(JSON.stringify(jsonGraph))
    const indices = JSONParser.JSONToIndices(jsonIndice)

    setIndiceData(indices[0])
    if (personNetwork == null){
      return
    }
    const graph = GraphCreator.CreateGraph(personNetwork)

    const nodes = new DataSet(graph.nodesPerson);

    setIndicesData(indices)
    setPersonData(personNetwork.getPersons()[4])

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

    // Configuration des options du Graphe
    const initialOptions = {

        layout: {
            improvedLayout: true,
            hierarchical: {
                enabled: false,
                direction: 'LR', // LR (Left to Right) ou autre selon votre préférence
                sortMethod: 'hubsize'
            },
            randomSeed: 2
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

    const myFunctionInsideEffect = () => {
      if (stepTuto === 3){
        const tabGrey = [0, 1, 2, 3, 5, 6, 7, 8, 9]
        for (const i of tabGrey){
          nodes.update({id: i, color: "#808080"})
        }
      }
    };

    setGreyForEveryone(() => myFunctionInsideEffect);


    network.on("click", async (params) => {
      
      if(params.nodes.length > 0){
      }
    });

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
        if (stepTuto === 0 && touchedPlayer === 1){
          const node = nodes.get().find((n: NodePerson) => n.id === params.nodes[0])
          if (node.id === 7){
            nodes.update({id: node.id, label: node.label + positionToEmoji(1, true)})
            handleShowTurnBar(false)
            setPlayerIndex(1)
            setPlayerTouched(-1)
            await delay(500)
            const node2 = nodes.get().find((n: NodePerson) => n.id === params.nodes[0])
            nodes.update({id: node.id, label: node2.label + positionToEmoji(2, false)})
            await delay(500)
            const node3 = nodes.get().find((n: NodePerson) => n.id === 8)
            nodes.update({id: node3.id, label: node3.label + positionToEmoji(1, false)})
            setPlayerIndex(2)
            await delay(500)
            const node4 = nodes.get().find((n: NodePerson) => n.id === 0)
            nodes.update({id: node4.id, label: node4.label + positionToEmoji(1, true)})
            setPlayerIndex(0)
            setTutoStep(1)
          }
        }
        else if(stepTuto === 1 && touchedPlayer === 2){
          const node = nodes.get().find((n: NodePerson) => n.id === params.nodes[0])
          if (node.id === 0){
            nodes.update({id: node.id, label: node.label + positionToEmoji(2, false)})
            setPlayerTouched(-1)
            handleTurnBarTextChange("Mauvais choix, posez un carré !")
            const tabGrey = [7, 0, 4, 1, 8]
            for (const id of tabGrey){
              const node = nodes.get().find((n: NodePerson) => n.id === id)
              nodes.update({id: node.id, color: "#808080"})
            }
            setTutoStep(2)
          }
        }
        else if(stepTuto === 2){
          const node = nodes.get().find((n: NodePerson) => n.id === params.nodes[0])
          if (node.id === 9){
            const tabColor = [7, 0, 4, 1, 8]
            nodes.update({id: node.id, label: node.label + positionToEmoji(0, false)})
            for(const id of tabColor){
              const pers = personNetwork.getPersons().find((p: Person) => p.getId() === id)
              if (pers !== undefined){
                nodes.update({id: id, color: ColorToHexa(pers.getColor())})
              }
            }
            handleShowTurnBar(false)
            setPlayerIndex(1)
            await delay(500)
            const node2 = nodes.get().find((n: NodePerson) => n.id === 4)
            nodes.update({id: node2.id, label: node2.label + positionToEmoji(2, true)})
            setPlayerIndex(2)
            await delay(500)
            const node3 = nodes.get().find((n: NodePerson) => n.id === 3)
            nodes.update({id: node3.id, label: node3.label + positionToEmoji(0, false)})
            await delay(500)
            const node4 = nodes.get().find((n: NodePerson) => n.id === 1)
            nodes.update({id: node4.id, label: node4.label + positionToEmoji(2, false)})
            setPlayerIndex(0)
            handleTurnBarTextChange("A vous de jouer !")
            handleShowTurnBar(true)
            setTutoStep(3)
          }
        }
        else if(stepTuto === 3 && touchedPlayer === 3){
          const node = nodes.get().find((n: NodePerson) => n.id === params.nodes[0])
          if (node.id === 4){
            nodes.update({id: node.id, label: node.label + positionToEmoji(0, true)})
            setPlayerTouched(-1)
            await delay(500)
            const node2 = nodes.get().find((n: NodePerson) => n.id === 4)
            nodes.update({id: node2.id, label: node2.label + positionToEmoji(1, true)})
            await delay(500)

            for(const person of personNetwork.getPersons()){
              nodes.update({id: person.getId(), color: ColorToHexa(person.getColor())})
            }
            if (user != null){
              const winner = user;
              setNetworkDataData(networkData)
              setActualPlayerIndexData(-1)
              setLastIndex(-1)
              setPlayerTouched(-1)
              setWinnerData(winner)      
              first = true
              navigate(`${basePath}/endgame`)
            }  
          }
        }
      }
      else{
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

}



export default TutorialGraph;