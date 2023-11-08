import cloneDeep from "lodash/cloneDeep";
import IndiceTesterFactory from "../Factory/IndiceTesterFactory";
import EdgesIndice from "../Indices/EdgesIndice";
import Indice from "../Indices/Indice";
import NbEdgesIndice from "../Indices/NbEdgesIndice";
import NbEdgesIndiceTester from "../IndiceTester/NbEdgesIndiceTester";
import Person from "../Person";
import PersonNetwork from "../PersonsNetwork";
import IndiceEdgesCreator from "./IndiceEdgesCreator";

class NbEdgesIndiceEdgesCreator implements IndiceEdgesCreator{

    private indice: NbEdgesIndice

    constructor(indice: NbEdgesIndice){
        this.indice = indice
    }

    createWorkingEdges(personNetwork: PersonNetwork, person: Person, indices: Indice[]): number {
        let indiceTest = new NbEdgesIndiceTester(this.indice)
        const nbEdges = this.indice.getNbEdges() + Math.floor(Math.random() * 2)
        personNetwork.getPersons().forEach(p => {
            if (person.getFriends().length == nbEdges){
                return
            }
            if (p!=person){
                let testEdgeWork = 0
                const p1 = cloneDeep(p)
                p1.addFriend(person)
                indices.forEach((indice) => {
                    const tester = IndiceTesterFactory.Create(indice)
                    if (tester.Works(p1)){
                        testEdgeWork ++
                    }
                });        
                if (testEdgeWork < indices.length){
                    p.addFriend(person)
                    person.addFriend(p)
                }
            }
        });
        return person.getFriends().length
    }
    
}

export default NbEdgesIndiceEdgesCreator