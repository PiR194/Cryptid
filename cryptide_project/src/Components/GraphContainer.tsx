import React, { useEffect } from "react";
import { DataSet, Network} from "vis-network/standalone/esm/vis-network";
import EdgesCreator from "../source/EdgesCreator";
import GraphCreator from "../source/Graph/GraphCreator";
import IndiceChooser from "../source/IndiceChooser";
import NetworkGenerator from "../source/NetworkGenerator";
import Stub from "../source/Stub";
import "./GraphContainer.css";

const edgesCreator = new EdgesCreator()

const chooser = new IndiceChooser()

const indices = Stub.GenerateIndice()

const network = NetworkGenerator.GenerateNetwork(30)

const rand = Math.floor(Math.random() * 30)
const person = network.getPersons()[rand]

const choosenIndices = chooser.chooseIndice(network, person, indices, 3)

edgesCreator.CreateAllEdges(network, person, choosenIndices)

const graph = GraphCreator.CreateGraph(network)

console.log(network)
console.log(graph)


const MyGraphComponent = () => {
  useEffect(() => {
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

    // Gérer le changement entre la physique et le déplacement manuel
    network.on("dragging", (params) => {
        if (params.nodes.length > 0) {
            // Un nœud a été cliqué
            initialOptions.physics.enabled = false;
            network.setOptions(initialOptions);
        }
    });

  }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une fois après le premier rendu

  return (
    <>
      <div id="graph-container"/>
    </>
  );
};

export default MyGraphComponent;