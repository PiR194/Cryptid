import AgeIndice from "../Indices/AgeIndice";
import ColorIndice from "../Indices/ColorIndice";
import SportIndice from "../Indices/SportIndice";
import Person from "../Person";
import IndiceTester from "./IndiceTester";

class SportIndiceTester implements IndiceTester{

    private sportIndice: SportIndice

    constructor(sportIndice: SportIndice){
        this.sportIndice = sportIndice;
    }

    Works(person: Person): boolean {
        for (const sport of person.getSports()){
            if (this.sportIndice.getSports().includes(sport)){
                return true
            }
        }
        return false
    }

    TestWorks(person: Person): boolean {
        for (const sport of person.getSports()){
            if (this.sportIndice.getSports().includes(sport)){
                return true
            }
        }
        return false
    }
}

export default SportIndiceTester