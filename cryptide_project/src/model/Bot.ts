import PersonNetwork from "./PersonsNetwork";
import Player from "./Player";

abstract class Bot extends Player{

    constructor( id: string, name: string){
        super(id, name);
    }

    abstract playRound(personNetwork : PersonNetwork, players: Player): [number, boolean]
}

export default Bot