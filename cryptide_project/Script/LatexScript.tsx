import PersonNetwork from "../src/model/PersonsNetwork";
import Person from "../src/model/Person";
import GenerateNetwork from "../src/model/NetworkGenerator";
import NetworkGenerator from "../src/model/NetworkGenerator";

import fs from 'fs';
import Stub from "../src/model/Stub";
import GameCreator from "../src/model/GameCreator";
import Indice from "../src/model/Indices/Indice";
import { SportToString } from "../src/model/EnumExtender";

function generateLatexCode(personsNet : PersonNetwork, choosenPerson : Person, choosenIndices : Indice[]) {
    let latexCode = "";
    


    //*Setup
    latexCode += "\\documentclass[11pt]{article}\n"
    latexCode += "\\usepackage{fullpage}\n"
    latexCode += "\\usepackage{times}\n"
    latexCode += "\\usepackage{tikz}\n"
    latexCode += "\\usepackage{paralist}\n"
    
    latexCode += "\\usetikzlibrary {shapes.multipart}\n"


    //! A quoi sert "fille" ?
    // latexCode += "%\\newcommand{\\fille}[1]{\\underline{#1}}"
    // latexCode += "\\newcommand{\\fille}[1]{#1} % Solution"

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



    personsNet.getPersons().forEach((person, index) => {

        const xCoordinate = index % 5;
        const yCoordinate = Math.floor(index / 5);

        const scaledX = xCoordinate * 2;
        const scaledY = yCoordinate * 2;

        latexCode += `  \\node[draw, circle split] (${person.getId()}) at (${scaledX},${scaledY}) { ${person.getName()} \\nodepart{lower}`;

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
fs.writeFileSync(filePath, latexCode, 'utf-8');
console.log(`Le code LaTeX a été enregistré dans le fichier : ${filePath}`);
