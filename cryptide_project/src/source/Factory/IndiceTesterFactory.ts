import AgeIndice from "../Indices/AgeIndice";
import Indice from "../Indices/Indice";
import IndiceTester from "../IndiceTester/IndiceTester";
import IndiceTesterAge from "../IndiceTester/IndiceTesterAge";

class IndiceTesterFactory{

    static Create(indice: Indice): IndiceTester{
        if (indice instanceof AgeIndice){
            return new IndiceTesterAge(indice)
        }
        throw new Error("Method not finished.");
    }
}

export default IndiceTesterFactory