import { DataSet } from "vis-network";
import NodePerson from "./Graph/NodePerson";
import Indice from "./Indices/Indice";
import Pair from "./Pair";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";
import Player from "./Player";

abstract class Bot extends Player{

    public indice: Indice | undefined
    public index : number

    public actualNetwork: Map<Person, Pair<number, boolean>[]>

    constructor( id: string, name: string){
        super(id, name);
        this.actualNetwork = new Map<Person, Pair<number, boolean>[]>()
        this.index = -1

    }

    abstract playRound(personNetwork : PersonNetwork, players: Player[]): [number, number]

    abstract placeSquare(personNetwork : PersonNetwork, players: Player[]): number

    abstract newInformation(person: Person, playerIndex: number, works: boolean): void

    abstract initiateMap(personNetwork: PersonNetwork): void
}

export default Bot