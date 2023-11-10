import AgeIndice from "../Indices/AgeIndice";
import ColorIndice from "../Indices/ColorIndice";
import NbSportIndice from "../Indices/NbSportIndice";
import Person from "../Person";
import IndiceTester from "./IndiceTester";

class NbSportIndiceTester implements IndiceTester{

    private nbSportIndice: NbSportIndice

    constructor(nbSportIndice: NbSportIndice){
        this.nbSportIndice = nbSportIndice;
    }

    Works(person: Person): boolean {
        return this.nbSportIndice.getNbSport() ==  person.getSports().length
    }

    TestWorks(person: Person): boolean {
        return this.nbSportIndice.getNbSport() ==  person.getSports().length
    }
}

export default NbSportIndiceTester