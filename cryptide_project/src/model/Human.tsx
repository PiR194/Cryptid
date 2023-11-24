import Player from "./Player";
import defaultImg from '../res/img/Person.png'

class Human extends Player{

    public pdp: string;

    constructor(id: string, name: string){
        super(id, name)
        this.pdp = defaultImg;
    }
    
    toJson() {
        return {
            type: "Human",
            id: this.id,
            name: this.name,
        };
    }
}

export default Human