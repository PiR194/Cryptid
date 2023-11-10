import IndiceTesterFactory from "./Factory/IndiceTesterFactory";
import EdgesIndice from "./Indices/EdgesIndice";
import Indice from "./Indices/Indice";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";
import cloneDeep from 'lodash/cloneDeep';
import IndiceEdgesFactory from "./Factory/IndiceEdgesCreatorFactory";
import AgeIndice from "./Indices/AgeIndice";
import ColorIndice from "./Indices/ColorIndice";
import SportIndice from "./Indices/SportIndice";
import NbSportIndice from "./Indices/NbSportIndice";


class IndiceChooser{

    chooseIndice(personNetwork: PersonNetwork, choosenPerson: Person, indices: Indice[], nbPlayer: number): Indice[]{
        const choosenIndices: Indice[] = []
        const ageIndice : Indice[] = []
        const sportIndice : Indice[] = []
        const colorIndice : Indice[] = []
        const edgeIndice : Indice[] = []
        const nbSportIndice : Indice[] = []

        const tabIndice: Indice[][] = []

        for (const indice of indices){
            if (indice instanceof EdgesIndice){
                edgeIndice.push(indice)
                continue
            }
            const tester = IndiceTesterFactory.Create(indice)
            if (tester.Works(choosenPerson)){
                if (indice instanceof AgeIndice){
                    ageIndice.push(indice)
                }
                else if(indice instanceof ColorIndice){
                    colorIndice.push(indice)
                }
                else if(indice instanceof SportIndice){
                    sportIndice.push(indice)
                }
                else if(indice instanceof NbSportIndice){
                    nbSportIndice.push(indice)
                }
            }
        }
        let test = [...tabIndice]
        if (ageIndice.length > 0) tabIndice.push(ageIndice)
        if (colorIndice.length > 0) tabIndice.push(colorIndice)
        if (sportIndice.length > 0) tabIndice.push(sportIndice)
        if (nbSportIndice.length > 0) tabIndice.push(nbSportIndice)

        for (let i = 0; i<nbPlayer-1; i++){
            if (test.length == 0){
                if (ageIndice.length > 0) test.push(ageIndice)
                if (colorIndice.length > 0) test.push(colorIndice)
                if (sportIndice.length > 0) test.push(sportIndice)
                if (nbSportIndice.length > 0) test.push(nbSportIndice)
            }
            
            const rand = Math.floor(Math.random() * test.length)
            const rand2 = Math.floor(Math.random() * test[rand].length)
            choosenIndices.push(test[rand][rand2])
            test[rand].splice(rand2, 1)
            test.splice(rand, 1)
            
        }
        const rand = Math.floor(Math.random() * edgeIndice.length)
        choosenIndices.push(edgeIndice[rand])
        return choosenIndices
    } 

}

export default IndiceChooser
