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

const [networkPerson, choosenPerson, choosenIndices, graph] = GameCreator.CreateGame(3, 30)


console.log(networkPerson)
console.log(graph)
choosenIndices.forEach((indice) =>{
  console.log(indice.ToString("fr"))
});
console.log(choosenPerson)
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
          //@ts-ignore
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