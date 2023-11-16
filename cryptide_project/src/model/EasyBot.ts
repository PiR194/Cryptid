import Bot from "./Bot";
import Indice from "./Indices/Indice";
import PersonNetwork from "./PersonsNetwork";
import Player from "./Player";

class EasyBot extends Bot{

    public indice: Indice | undefined

    constructor(id: string, name: string){
        super(id, name)
    }

    toJson() {
        return {
            type: "EasyBot",
            id: this.id,
            name: this.name,
        };
    }

    playRound(personNetwork: PersonNetwork, players: Player): [number, boolean] {
        return [1, false]
    }

}

export default EasyBot