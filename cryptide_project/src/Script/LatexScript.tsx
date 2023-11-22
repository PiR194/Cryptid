import PersonNetwork from "../model/PersonsNetwork";
import Person from "../model/Person";
import GenerateNetwork from "../model/NetworkGenerator";
import NetworkGenerator from "../model/NetworkGenerator";

import fs from 'fs';
import Stub from "../model/Stub";
import GameCreator from "../model/GameCreator";
import Indice from "../model/Indices/Indice";
import { ColorToString, SportToString } from "../model/EnumExtender";
import GraphCreator from "../model/Graph/GraphCreator";
import { DataSet, Network } from "vis-network";

function generateLatexCode(personsNet : PersonNetwork, choosenPerson : Person, choosenIndices : Indice[], network: Network): string {
    let latexCode = "";


    //*Setup
    latexCode += "\\documentclass[11pt]{article}\n"
    latexCode += "\\usepackage{fullpage}\n"
    latexCode += "\\usepackage{times}\n"
    latexCode += "\\usepackage{tikz}\n"
    latexCode += "\\usepackage{paralist}\n"
    latexCode += "\\usepackage{geometry}\n"
    
    latexCode += "\\usetikzlibrary {shapes.multipart}\n"
    latexCode += "\\geometry{margin=0.5cm}\n"
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
    latexCode+= "\\begin{tikzpicture}[scale=.17]\n"
    
    
    personsNet.getPersons().forEach((person, index) => {

        var nodesData = network.getPositions();
        // Obtenir les coordonnées du nœud
        const nodeId = person.getId().toString();
        const position = nodesData[nodeId];
        if (position) {
            const x = (position.x / 9).toFixed(2); // Arrondir à 2 décimales
            const y = (position.y / 9).toFixed(2);
    
            latexCode += `  \\node[draw, circle split, align=center] (${person.getId()}) at (${x},${y}) { ${person.getName()} \\\\ ${person.getAge()} \\nodepart{lower}`;
            latexCode += `${ColorToString(person.getColor(), "fr")} \\\\`
            person.getSports().forEach((sport) => { latexCode += ` \\${SportToString(sport, 'fr')}{}` });
            latexCode += "};\n";
        } else {
            console.error(`Les coordonnées du nœud ${nodeId} ne sont pas disponibles.`);
        }
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

   return latexCode
}

export default generateLatexCode