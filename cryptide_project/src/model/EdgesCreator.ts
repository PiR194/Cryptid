import IndiceTesterFactory from "./Factory/IndiceTesterFactory";
import EdgesIndice from "./Indices/EdgesIndice";
import Indice from "./Indices/Indice";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";
import cloneDeep from 'lodash/cloneDeep';
import IndiceEdgesFactory from "./Factory/IndiceEdgesCreatorFactory";


class EdgesCreator{

    CreateWorkingEdge(personNetwork: PersonNetwork, choosenPerson: Person, indice: Indice, indices: Indice[]){
        let creator = IndiceEdgesFactory.Create(indice)

        const nbMaxEdge = creator.createWorkingEdges(personNetwork, choosenPerson, indices)

        if (choosenPerson.getFriends().length < nbMaxEdge){
            for (const p of personNetwork.getPersons()){
                if (choosenPerson.getFriends().length == nbMaxEdge){
                    return
                }
                if (p!=choosenPerson && !choosenPerson.getFriends().includes(p)){
                    let testEdgeWork = 0
                    const p1 = cloneDeep(p);
                    const personEdge = cloneDeep(choosenPerson);
                    p1.addFriend(personEdge)
                    personEdge.addFriend(p1)
                    indices.forEach((indice) => {
                        const tester = IndiceTesterFactory.Create(indice)
                        if (tester.Works(p1)){
                            testEdgeWork ++
                        } 
                    });
                    
                    if (testEdgeWork < indices.length){
                        p.addFriend(choosenPerson)
                        choosenPerson.addFriend(p)
                    }
                }
            }
        }
    }

    CreateNotWorkingEdge(personNetwork: PersonNetwork, personToCreateEdge: Person, choosenPerson: Person, indices: Indice[], map: Map<number, number>){
        const test = [...personNetwork.getPersons()]
        shuffleArray(test)
        test.forEach((p) => {
            if (personToCreateEdge.getFriends().length == map.get(personToCreateEdge.getId())){
                return
            }
            if (p != personToCreateEdge && p != choosenPerson && !personToCreateEdge.getFriends().includes(p)){
                let testEdgeWork1 = 0
                let testEdgeWork2 = 0
                const p1 = cloneDeep(p);
                const personEdge = cloneDeep(personToCreateEdge);
                p1.addFriend(personEdge)
                personEdge.addFriend(p1)
                indices.forEach((indice) => {
                    const tester = IndiceTesterFactory.Create(indice)
                    if (tester.Works(p1) || map.get(p.getId()) === p.getFriends().length){
                        testEdgeWork1 ++
                    } 
                    if (tester.Works(personEdge) || map.get(p.getId()) === p.getFriends().length){
                        testEdgeWork2 ++
                    }
                });
                
                if (testEdgeWork1 < indices.length && testEdgeWork2 < indices.length){
                    p.addFriend(personToCreateEdge)
                    personToCreateEdge.addFriend(p)
                }
            }
        });
    }

    CreateAllEdges(personNetwork: PersonNetwork, choosenPerson: Person, indices: Indice[]){
        const test = new Map<number, number>()
        const tabEdgesSize: number[] = []
        for (let i = 0; i<personNetwork.getPersons().length / 4; i++){
            tabEdgesSize.push(1)
            tabEdgesSize.push(2)
            tabEdgesSize.push(3)
            tabEdgesSize.push(4)
        }
        indices.forEach(indice => {
            if (indice instanceof EdgesIndice){
                this.CreateWorkingEdge(personNetwork, choosenPerson, indice, indices)
            }
        });
        personNetwork.getPersons().forEach((p) => {
            if (p != choosenPerson){
                const rand = Math.floor(Math.random() * 4)
                test.set(p.getId(), tabEdgesSize[rand] + p.getFriends().length)
                tabEdgesSize.splice(rand, 1)
            }
        });
        personNetwork.getPersons().forEach((p) => {
            if (p != choosenPerson){
                
                this.CreateNotWorkingEdge(personNetwork, p, choosenPerson, indices, test)
            }
        });
    }
}


function shuffleArray(array: Person[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export default EdgesCreator
