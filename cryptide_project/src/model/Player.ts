import defaultImg from '../res/img/Person.png'

abstract class Player{
    public id: string
    public name: string;
    public pdp: string;

    constructor(id: string, name: string){
        this.id=id
        this.name=name
        this.pdp = defaultImg;
    }

    abstract toJson(): any
}

export default Player