import PersonNetwork from "../src/model/PersonsNetwork";
import Person from "../src/model/Person";
import GenerateNetwork from "../src/model/NetworkGenerator";
import NetworkGenerator from "../src/model/NetworkGenerator";

import fs from 'fs';
import Stub from "../src/model/Stub";
import GameCreator from "../src/model/GameCreator";
import Indice from "../src/model/Indices/Indice";
import { SportToString } from "../src/model/EnumExtender";
import GraphCreator from "../src/model/Graph/GraphCreator";
import { DataSet, Network } from "vis-network";

function generateLatexCode(personsNet : PersonNetwork, choosenPerson : Person, choosenIndices : Indice[]) {
    let latexCode = "";


    //*Setup
    latexCode += "\\documentclass[11pt]{article}\n"
    latexCode += "\\usepackage{fullpage}\n"
    latexCode += "\\usepackage{times}\n"
    latexCode += "\\usepackage{tikz}\n"
    latexCode += "\\usepackage{paralist}\n"
    
    latexCode += "\\usetikzlibrary {shapes.multipart}\n"

    latexCode += "\\newcommand{\\Basketball}{\\includegraphics[width=.5cm]{ballon-de-basket.png}}\n"
    latexCode += "\\newcommand{\\Football}{\\includegraphics[width=.4cm]{ballon-de-foot.png}}\n"
    latexCode += "\\newcommand{\\Bowling}{\\includegraphics[width=.5cm]{bowling.png}}\n"
    latexCode += "\\newcommand{\\Baseball}{\\includegraphics[width=.5cm]{baseball.png}}\n"
    latexCode += "\\newcommand{\\Tennis}{\\includegraphics[width=.5cm]{tennis.png}}\n"


    //** Header
    latexCode+= "\\begin{document}\n"
    latexCode+= "\\thispagestyle{empty}\n"
    latexCode+= "Voici le graphe de SocialGraphe\n"
    latexCode+= "\\begin{center}\n"
    latexCode+= "\\begin{tikzpicture}[scale=.9]\n"


    //? Coordonnée en position.
    //! marche pas
    // const graph = GraphCreator.CreateGraph(personsNet)

    // const container = document.getElementById('graph-container');
    // if (!container) {
    //     console.error("Container not found");
    //     return;
    // }
    // // Charger les données dans le graph
    // const nodes = new DataSet(graph.nodesPerson);

    // // Configuration des options du Graphe
    // const initialOptions = {
    //     layout: {
    //         improvedLayout: true,
    //         hierarchical: {
    //             enabled: false,
    //             direction: 'LR', // LR (Left to Right) ou autre selon votre préférence
    //             sortMethod: 'hubsize'
    //         }
    //     },
    //     physics: {
    //         enabled: true,
    //         barnesHut: {
    //             gravitationalConstant: -1000,
    //             springConstant: 0.001,
    //             springLength: 100
    //         }
    //     }
    // };
    
    // const networkData = { nodes: nodes, edges: graph.edges };
    // const network = new Network(container, networkData, initialOptions);
    
    
    personsNet.getPersons().forEach((person, index) => {


        // //? Coordonnée en forme de grille.
        const xCoordinate = index % 5;
        const yCoordinate = Math.floor(index / 5);
        const scaledX = xCoordinate * 4;
        const scaledY = yCoordinate * 4;
        
        latexCode += `  \\node[draw, circle split] (${person.getId()}) at (${scaledX},${scaledY}) { ${person.getName()} \\nodepart{lower}`;



        //? Coordonnée en position.
        //! marche pas
        // var nodesData = network.getPositions();
        // // for (var nodeId in nodesData) {
        // //     if (nodesData.hasOwnProperty(nodeId)) {
        // //         var position = nodesData[nodeId];
        // //         console.log("Nœud " + nodeId + " - Position : x = " + position.x + ", y = " + position.y);
        // //     }
        // // }
        // // latexCode += `  \\node[draw, circle split] (${person.getId()}) at (${x},${y}) { ${person.getName()} \\nodepart{lower}`; //x et y de la  position

        // // Obtenir les coordonnées du nœud
        // const nodeId = person.getId().toString();
        // const position = nodesData[nodeId];
        // if (position) {
        //     const x = position.x.toFixed(2); // Arrondir à 2 décimales
        //     const y = position.y.toFixed(2);
    
        //     latexCode += `  \\node[draw, circle split] (${person.getId()}) at (${x},${y}) { ${person.getName()} \\nodepart{lower}`;
            
        //     person.getSports().forEach((sport) => { latexCode += ` \\${SportToString(sport, 'fr')}{}` });
        //     latexCode += "};\n";
        // } else {
        //     console.error(`Les coordonnées du nœud ${nodeId} ne sont pas disponibles.`);
        // }


        person.getSports().forEach((sport) => { latexCode += ` \\${SportToString(sport, 'fr')}{}`})
        latexCode += "};\n";
    });
    
    personsNet.getPersons().forEach((person) => {
        person.getFriends().forEach((friend) => {
            latexCode += `  \\draw (${person.getId()}) -- (${friend.getId()});\n`;
        });
        console.log(person.getFriends().length);
    });
    
    latexCode += "\\end{tikzpicture}\n";
    latexCode += "\\end{center}\n";

    //* Zone d'énoncé :

    latexCode += "\n\n\\paragraph{Première énigme}\n"

    
    latexCode += "Trouver qui est le coupable avec les indices suivants.\n"
    latexCode += "\\begin{compactitem}\n"


    choosenIndices.forEach((indice, index) => {

        latexCode += `\\item Indice ${index + 1} : ${indice.ToString('fr')}.\n`
    })
    latexCode += "\\end{compactitem}\n"

    //* Solution
    latexCode += "% Solution : " + choosenPerson.getName() + "\n";

    
    latexCode += "\\end{document}\n"
    return latexCode;
}


const [networkPerson, choosenPerson, choosenIndices] = GameCreator.CreateGame(4, 30);
const latexCode = generateLatexCode(networkPerson, choosenPerson, choosenIndices);


const filePath = './graph.tex';
if (typeof latexCode === 'undefined') {
    console.log('Variable is undefined');
}
else{
    fs.writeFileSync(filePath, latexCode, 'utf-8');
}
console.log(`Le code LaTeX a été enregistré dans le fichier : ${filePath}`);
