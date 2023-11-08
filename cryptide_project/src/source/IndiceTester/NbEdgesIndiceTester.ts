import AgeIndice from "../Indices/AgeIndice";
import NbEdgesIndice from "../Indices/NbEdgesIndice";
import Person from "../Person";
import IndiceTester from "./IndiceTester";

class NbEdgesIndiceTester implements IndiceTester{

    private nbEdgesIndice: NbEdgesIndice

    constructor(nbEdgesIndice: NbEdgesIndice){
        this.nbEdgesIndice = nbEdgesIndice;
    }

    Works(person: Person): boolean {
        return person.getFriends().length >= this.nbEdgesIndice.getNbEdges()
    }

    TestWorks(person: Person): boolean {
        return true
    }
}

export default NbEdgesIndiceTester