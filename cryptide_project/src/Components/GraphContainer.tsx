import React, { useEffect } from "react";
import { DataSet, Network} from "vis-network/standalone/esm/vis-network";
import EdgesCreator from "../source/EdgesCreator";
import GraphCreator from "../source/Graph/GraphCreator";
import IndiceChooser from "../source/IndiceChooser";
import SportIndice from "../source/Indices/SportIndice";
import NetworkGenerator from "../source/NetworkGenerator";
import Sport from "../source/Sport";
import Stub from "../source/Stub";
import "./GraphContainer.css";
import NodePerson from "../source/Graph/NodePerson";
import IndiceTesterFactory from "../source/Factory/IndiceTesterFactory";

const edgesCreator = new EdgesCreator()

const chooser = new IndiceChooser()

const indices = Stub.GenerateIndice()

const networkPerson = NetworkGenerator.GenerateNetwork(50)

const rand = Math.floor(Math.random() * 50)
const person = networkPerson.getPersons()[rand]

const choosenIndices = chooser.chooseIndice(networkPerson, person, indices, 8)

edgesCreator.CreateAllEdges(networkPerson, person, choosenIndices)

const graph = GraphCreator.CreateGraph(networkPerson)


let indice = new SportIndice(12, [Sport.TENNIS, Sport.BASEBALL])
console.log(networkPerson)
console.log(graph)
choosenIndices.forEach((indice) =>{
  console.log(indice.ToString("fr"))
});
console.log(person)
const testIndice = choosenIndices[0]

interface MyGraphComponentProps {
  onNodeClick: (shouldShowChoiceBar: boolean) => void;
}

const MyGraphComponent: React.FC<MyGraphComponentProps> = ({onNodeClick}) => {
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

    //TEST POUR MONTRER QU'IL Y EN A QU'UN A CHAQUE FOIS
    /*
    networkPerson.getPersons().forEach(p => {
      let a = 0
      for (let i of choosenIndices){
        let tester = IndiceTesterFactory.Create(i)
        if (tester.Works(p)){
          a++
        }
      }
      if (a==choosenIndices.length){
        networkData.nodes.update({id: p.getId(), label: p.getName() + "\n🔵"})
      }
      
    });
    */

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
        //TEST POUR VOIR SI ON PEUT RAJOUTER DES TRUCS AU LABEL
        
        const pers = networkPerson.getPersons().find((p) => p.getId() == params.nodes[0])
        if (pers!=undefined){
          const node = nodes.get().find((n) => params.nodes[0] == n.id)
          if (node != undefined){
            var tester = IndiceTesterFactory.Create(testIndice)
            if (tester.Works(pers)){
              networkData.nodes.update({id: params.nodes[0], label: node.label + "🔵"})
            }
            else{
              networkData.nodes.update({id: params.nodes[0], label: node.label + "🟦"})
            }
          }
          
        }
        

        // Renvoyer un true pour afficher la choice bar
        onNodeClick(true)
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
};

export default MyGraphComponent;