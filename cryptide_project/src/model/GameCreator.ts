import { TupleType } from "typescript";
import EdgesCreator from "./EdgesCreator";
import GraphCreator from "./Graph/GraphCreator";
import GraphPerson from "./Graph/GraphPerson";
import IndiceChooser from "./IndiceChooser";
import Indice from "./Indices/Indice";
import NetworkGenerator from "./NetworkGenerator";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";
import Stub from "./Stub";

class GameCreator{
    static CreateGame(nbPlayers: number, nbNodes: number): [PersonNetwork, Person, Indice[], GraphPerson]{
        const edgesCreator = new EdgesCreator()

        const chooser = new IndiceChooser()

        const indices = Stub.GenerateIndice()

        const networkPerson = NetworkGenerator.GenerateNetwork(nbNodes)

        const rand = Math.floor(Math.random() * nbNodes)
        const person = networkPerson.getPersons()[rand]

        const choosenIndices = chooser.chooseIndice(person, indices, nbPlayers)

        edgesCreator.CreateAllEdges(networkPerson, person, choosenIndices)

        const graph = GraphCreator.CreateGraph(networkPerson)

        return [networkPerson, person, choosenIndices, graph]

    }
}

export default GameCreator