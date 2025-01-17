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
import Pair from "../model/Pair";

function generateLatexCode(personsNet : PersonNetwork, choosenPerson : Person, choosenIndices : Indice[], network: Network): string {
    let latexCode = "";

    //*Setup
    latexCode += "\\documentclass[11pt]{article}\n"
    latexCode += "\\usepackage[landscape]{geometry}\n"
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
    latexCode+= "\\resizebox{.65\\textwidth}{!}{\n"
    latexCode+= "\\begin{tikzpicture}[scale=.18]\n"
    
    
    personsNet.getPersons().forEach((person, index) => {

        var nodesData = network.getPositions();
        // Obtenir les coordonnées du nœud
        const nodeId = person.getId().toString();
        const position = nodesData[nodeId];
        if (position) {
            const x = (position.x / 5).toFixed(2); // Arrondir à 2 décimales
            const y = (position.y / 5).toFixed(2);
    
            latexCode += `  \\node[draw, circle split, align=center] (${person.getId()}) at (${x},${y}) { ${person.getName()}  ${person.getAge()} \\nodepart{lower}`;
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
    });
    
    latexCode += "\\end{tikzpicture}\n";
    latexCode += "}\n"
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
    latexCode += "Solution : " + choosenPerson.getName() + "\n";
    
    latexCode += "\\end{document}\n"

   return latexCode
}


function generateLatexCodeEnigme(personsNet : PersonNetwork, choosenPerson : Person, choosenIndices : Indice[], network: Network, map : Map<number, Pair<Indice, boolean>[]>): string {
    let latexCode = "";

    //*Setup
    latexCode += "\\documentclass[11pt]{article}\n"
    latexCode += "\\usepackage[landscape]{geometry}\n"
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
    latexCode+= "\\resizebox{.65\\textwidth}{!}{\n"
    latexCode+= "\\begin{tikzpicture}[scale=.18]\n"
    
    
    personsNet.getPersons().forEach((person, index) => {

        var nodesData = network.getPositions();
        // Obtenir les coordonnées du nœud
        const nodeId = person.getId().toString();
        const position = nodesData[nodeId];
        if (position) {
            const x = (position.x / 9).toFixed(2); // Arrondir à 2 décimales
            const y = (position.y / 9).toFixed(2);
    
            latexCode += `  \\node[draw, circle split, align=center] (${person.getId()}) at (${x},${y}) { ${person.getName()}  ${person.getAge()} \\nodepart{lower}`;
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
    });
    
    latexCode += "\\end{tikzpicture}\n";
    latexCode += "}\n"
    latexCode += "\\end{center}\n";

    //* Zone d'énoncé :

    latexCode += "\n\n\\paragraph{Première énigme}\n"

    
    latexCode += "Trouver qui est le coupable avec les indices suivants.\n"
    latexCode += "\\begin{compactitem}\n"

    const personIndice = new Map<number, string[]>()
    choosenIndices.forEach((i, index) => {
        personIndice.set(index, [])
    })

    map.forEach((pairs, index) => {
        pairs.forEach((pair) => {
          const person = personsNet.getPersons().find((n) => index == n.getId())
          const indice = choosenIndices.findIndex((i) => pair.first.getId() == i.getId())
          if (person != undefined && indice != -1){
            let string = "L'indice numéro " + (indice + 1) + " répond "
            if (pair.second){
                string += "vrai "
            }
            else{
                string += "faux "
            }
            string += "pour " + person.getName()
            personIndice.get(indice)?.push(string)
          }
        })
      });

    personIndice.forEach((indices, index) => {
        latexCode += `\\item Indice ${index + 1}:\n`
        indices.forEach((string) => {
            latexCode += `\\item ${string}.\n`
        })
    })
    latexCode += "\\end{compactitem}\n"

    //* Solution
    latexCode += "Solution : " + choosenPerson.getName() + "\n";
    
    latexCode += "\\begin{compactitem}\n"
    choosenIndices.forEach((indices, index) => {
        latexCode += `\\item Indice ${index + 1}: ${indices.ToString("fr")}\n`
    })

    latexCode += "\\end{compactitem}\n"
    latexCode += "\\end{document}\n"

   return latexCode
}

export {generateLatexCode, generateLatexCodeEnigme}