import React, { useEffect } from "react";
import { DataSet, Network} from "vis-network/standalone/esm/vis-network";
import "./GraphContainer.css";

const NB_SPORTS = 3;
const MIN_AGE = 20;
const MAX_AGE = 100;
const COLORS = ["blanc", "noir", "jaune", "chocolat"];
const SPORTS = ["foot", "tennis", "rugby", "basket"];
const NAMES = ["Fabien", "Mélyssa", "Kéké", "David", "Elisa", "Karina", "Fatima", "Pintrand", "Pif", "Nathan", "Thomas", "Carreau", "Léo", "Hélicoptère", "Tank"]

class Person {
    id: number = 0;
    name: string;
    age: number;
    color: string;
    sport: string[];
    friends: Person[] = [];

    constructor(name: string, age: number, color: string, sport: string[]) {
        this.name = name;
        this.age = age;
        this.color = color;
        this.sport = sport || [];
    }

    getAge() {
        return this.age;
    }

    setAge(age: number) {
        this.age = age;
    }

    addFriend(person: Person) {
        // Si la personne n'est pas déjà dans la liste d'amis
        // et qu'il a pas déjà 5 amis ou plus
        // alors on l'ajoute
        if (!this.friends.includes(person) && this.friends.length < 5 && person.friends.length < 5) {
            this.friends.push(person);
            person.addFriend(this);
        }
    }

    getFriends() {
        return this.friends;
    }

    equals(person: Person) {
        return this.age === person.age &&
            this.color === person.color &&
            this.sportsEquals(person);
    }

    sportsEquals(person:Person) {
        return this.sport.length === person.sport.length &&
            this.sport.every(sport => person.sport.includes(sport));
    }

    toString() {
        return `Person(id = ${this.id}, age=${this.age}, color=${this.color}, sport=${this.sport}, friends=${this.friends.length})`;
    }
}

// Génère un élément aléatoire d'un tableau
function getRandomElement(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

// Génère un nombre aléatoire entre min et max
function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Génère une personne avec un age, une couleur et une liste de sports
function generatePerson(possibleNames: string[], possibleSports: string[], existingPeople: Person[]) {
    // Génère un age entre 20 et 100 ans
    const age = getRandomNumber(MIN_AGE, MAX_AGE);
    const color = getRandomElement(COLORS);
    const sports = [];
    let name = "";

    // Génère un nombre de sports entre 1 et NB_SPORTS
    const nbSports = getRandomNumber(1, NB_SPORTS);

    for (let i = 0; i < nbSports; i++) {
        // Gestion des sports
        // Si il n'y a plus de sports possibles, on reprend la liste de base
        if (possibleSports.length === 0) {
            possibleSports = SPORTS.slice();
        }

        // Génère un sport aléatoire
        // Si le sport est déjà dans la liste, on recommence
        const sport = getRandomElement(possibleSports);
        if (sports.indexOf(sport) === -1) {
            possibleSports.splice(possibleSports.indexOf(sport), 1);
            sports.push(sport);
        } else {
            i--;
        }

        // Gestion des prénoms
        // Si il n'y a plus de prénoms possibles, on reprend la liste de base
        if (possibleNames.length === 0) {
            possibleNames = NAMES.slice();
        }

        // Génère un prénom aléatoire et le supprime de la liste de prénom disponible
        name = getRandomElement(possibleNames);
        possibleNames.splice(possibleNames.indexOf(name), 1);
    }

    const newPerson = new Person(name, age, color, sports);

    // Vérifie si la personne n'est pas déjà dans la liste
    // Si déjà dans la liste, on recommence
    // if (existingPeople.some(person => person.equals(newPerson))) {
    //     return generatePerson(possibleSports, existingPeople);
    // }

    return newPerson;
}

function generatePeople(nbPeople: number) {
    const people = [];
    let possibleSports = SPORTS.slice();
    let possibleNames = NAMES.slice();

    for (let i = 0; i < nbPeople; i++) {
        const person = generatePerson(possibleNames, possibleSports, people);
        person.id += i;
        people.push(person);
    }

    return people;
}

// Ajouter des amis aléatoirement entre une liste de personnes
function addFriends(people: Person[]) {
    people.forEach(person => {
        // const nbFriends = getRandomNumber(0, people.length - 1);
        const nbFriends = getRandomNumber(1, 5);


        for (let i = 0; i < nbFriends; i++) {
            let friend = getRandomElement(people);

            // S'assurer que l'ami généré aléatoirement est différent de la personne
            while (friend === person) {
                friend = getRandomElement(people);
            }

            person.addFriend(friend);
        }
    });
}

const people = generatePeople(40);
addFriends(people);

const MyGraphComponent = () => {
  useEffect(() => {
    const container = document.getElementById('graph-container');
    if (!container) {
      console.error("Container not found");
      return;
    }

    // Création du réseau
    const persons: any[] = [];
    const edges: any[] = [];
    people.forEach(person => {
        const visPerson = {id: person.id, label: person.name};
        persons.push(visPerson);
        person.friends.forEach(friend => {
            // Eviter le double sens des relations
            if (edges.some(edge => edge.from === friend.id && edge.to === person.id || edge.from === person.id && edge.to === friend.id)) {
                return;
            }
            edges.push({from: person.id, to: friend.id});
        });
    });
    // Charger les données dans le graph
    const nodes = new DataSet(persons);

    // Configuration des options du Graphe
    const initialOptions = {
        nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
        },
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

    const networkData = { nodes: nodes, edges: edges };
    const network = new Network(container, networkData, initialOptions);

    // Gérer le changement entre la physique et le déplacement manuel
    let physicsEnabled = true;

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