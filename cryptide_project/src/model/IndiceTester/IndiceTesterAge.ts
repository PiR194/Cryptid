import AgeIndice from "../Indices/AgeIndice";
import Person from "../Person";
import IndiceTester from "./IndiceTester";

class IndiceTesterAge implements IndiceTester{

    private ageIndice: AgeIndice

    constructor(ageIndice: AgeIndice){
        this.ageIndice = ageIndice;
    }

    Works(person: Person): boolean {
        return person.getAge() >= this.ageIndice.getMinimum() && person.getAge()<= this.ageIndice.getMaximum()
    }
}

export default IndiceTesterAge