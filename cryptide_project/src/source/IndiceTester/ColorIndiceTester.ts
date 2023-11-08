import AgeIndice from "../Indices/AgeIndice";
import ColorIndice from "../Indices/ColorIndice";
import Person from "../Person";
import IndiceTester from "./IndiceTester";

class ColorIndiceTester implements IndiceTester{

    private colorIndice: ColorIndice

    constructor(colorIndice: ColorIndice){
        this.colorIndice = colorIndice;
    }

    Works(person: Person): boolean {
        return this.colorIndice.getColors().includes(person.getColor()) 
    }

    TestWorks(person: Person): boolean {
        return this.colorIndice.getColors().includes(person.getColor()) 
    }
}

export default ColorIndiceTester