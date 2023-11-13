import ColorIndiceEdgesCreator from "../IndiceEdgesCreator.ts/ColorIndiceEdgesCreator";
import IndiceEdgesCreator from "../IndiceEdgesCreator.ts/IndiceEdgesCreator";
import NbEdgesIndiceEdgesCreator from "../IndiceEdgesCreator.ts/NbEdgesIndiceEdgesCreator";
import AgeIndice from "../Indices/AgeIndice";
import ColorEdgesIndice from "../Indices/ColorEdgesIndice";
import ColorIndice from "../Indices/ColorIndice";
import Indice from "../Indices/Indice";
import NbEdgesIndice from "../Indices/NbEdgesIndice";
import ColorIndiceTester from "../IndiceTester/ColorIndiceTester";
import IndiceTester from "../IndiceTester/IndiceTester";
import IndiceTesterAge from "../IndiceTester/IndiceTesterAge";
import NbEdgesIndiceTester from "../IndiceTester/NbEdgesIndiceTester";

class IndiceEdgesFactory{

    static Create(indice: Indice): IndiceEdgesCreator{
        if (indice instanceof NbEdgesIndice){
            return new NbEdgesIndiceEdgesCreator(indice)
        }
        if (indice instanceof ColorEdgesIndice){
            return new ColorIndiceEdgesCreator(indice)
        }
        throw new Error("Method not finished.");
    }
}

export default IndiceEdgesFactory