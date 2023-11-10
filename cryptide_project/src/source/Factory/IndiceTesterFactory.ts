import AgeIndice from "../Indices/AgeIndice";
import ColorEdgesIndice from "../Indices/ColorEdgesIndice";
import ColorIndice from "../Indices/ColorIndice";
import Indice from "../Indices/Indice";
import NbEdgesIndice from "../Indices/NbEdgesIndice";
import NbSportIndice from "../Indices/NbSportIndice";
import SportIndice from "../Indices/SportIndice";
import ColorEdgesIndiceTester from "../IndiceTester/ColorIndiceEdgesTester";
import ColorIndiceTester from "../IndiceTester/ColorIndiceTester";
import IndiceTester from "../IndiceTester/IndiceTester";
import IndiceTesterAge from "../IndiceTester/IndiceTesterAge";
import NbEdgesIndiceTester from "../IndiceTester/NbEdgesIndiceTester";
import NbSportIndiceTester from "../IndiceTester/NbSportIndiceTester";
import SportIndiceTester from "../IndiceTester/SportIndiceTester";

class IndiceTesterFactory{

    static Create(indice: Indice): IndiceTester{
        if (indice instanceof AgeIndice){
            return new IndiceTesterAge(indice)
        }
        if (indice instanceof NbEdgesIndice){
            return new NbEdgesIndiceTester(indice)
        }
        if (indice instanceof ColorIndice){
            return new ColorIndiceTester(indice)
        }
        if (indice instanceof ColorEdgesIndice){
            return new ColorEdgesIndiceTester(indice)
        }
        if (indice instanceof SportIndice){
            return new SportIndiceTester(indice)
        }
        if (indice instanceof NbSportIndice){
            return new NbSportIndiceTester(indice)
        }
        throw new Error("Method not finished.");
    }
}

export default IndiceTesterFactory