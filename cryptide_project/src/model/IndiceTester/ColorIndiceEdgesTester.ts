import AgeIndice from "../Indices/AgeIndice";
import ColorEdgesIndice from "../Indices/ColorEdgesIndice";
import ColorIndice from "../Indices/ColorIndice";
import Person from "../Person";
import IndiceTester from "./IndiceTester";

class ColorEdgesIndiceTester implements IndiceTester{

    private colorEdgesIndice: ColorEdgesIndice

    constructor(colorEdgesIndice: ColorEdgesIndice){
        this.colorEdgesIndice = colorEdgesIndice;
    }

    Works(person: Person): boolean {
        let res = false
        person.getFriends().forEach(p => {
            if(this.colorEdgesIndice.getColors().includes(p.getColor())){
                res = true
                return true
            }
        });
        return res
    }
}

export default ColorEdgesIndiceTester