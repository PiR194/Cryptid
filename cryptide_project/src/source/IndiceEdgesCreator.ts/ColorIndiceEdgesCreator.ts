import cloneDeep from "lodash/cloneDeep";
import IndiceTesterFactory from "../Factory/IndiceTesterFactory";
import ColorEdgesIndice from "../Indices/ColorEdgesIndice";
import ColorIndice from "../Indices/ColorIndice";
import EdgesIndice from "../Indices/EdgesIndice";
import Indice from "../Indices/Indice";
import NbEdgesIndice from "../Indices/NbEdgesIndice";
import ColorEdgesIndiceTester from "../IndiceTester/ColorIndiceEdgesTester";
import ColorIndiceTester from "../IndiceTester/ColorIndiceTester";
import NbEdgesIndiceTester from "../IndiceTester/NbEdgesIndiceTester";
import Person from "../Person";
import PersonNetwork from "../PersonsNetwork";
import IndiceEdgesCreator from "./IndiceEdgesCreator";

class ColorIndiceEdgesCreator implements IndiceEdgesCreator{

    private indice: ColorEdgesIndice

    constructor(indice: ColorEdgesIndice){
        this.indice = indice
    }

    createWorkingEdges(personNetwork: PersonNetwork, person: Person, indices: Indice[]): number {
        let indiceTest = new ColorEdgesIndiceTester(this.indice)
        for (const p of personNetwork.getPersons()){
            let a = false
            if (p!=person){
                let testEdgeWork = 0
                const p1 = cloneDeep(p)
                p1.addFriend(person)
                const choosenOne = cloneDeep(person)
                choosenOne.addFriend(p1)
                if (indiceTest.Works(choosenOne)){
                    for (const indice of indices){
                        const tester = IndiceTesterFactory.Create(indice)
                        if (tester.Works(p1)){
                            testEdgeWork ++
                        }
                    }  
                    if (testEdgeWork < indices.length){
                        p.addFriend(person)
                        person.addFriend(p)
                        return 1
                    }
                }
            }
        }
        return person.getFriends().length
    }
    
}

export default ColorIndiceEdgesCreator