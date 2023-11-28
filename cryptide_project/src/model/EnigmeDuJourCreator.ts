import IndiceTesterFactory from "./Factory/IndiceTesterFactory";
import Indice from "./Indices/Indice";
import Pair from "./Pair";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";

class EnigmeDuJourCreator{


    static createEnigme(personNetwork: PersonNetwork, choosenIndices: Indice[], choosenPerson: Person, allIndices: Indice[]): Map<number, Pair<Indice, boolean>[]>{
        const map = new Map<number, Pair<Indice, boolean>[]>()
        personNetwork.getPersons().forEach((p) =>{
            map.set(p.getId(), [])
        })

        choosenIndices.forEach((choosenIndice) => {
            const choosenIndiceTester = IndiceTesterFactory.Create(choosenIndice)
            const modifiedPersons: Pair<Person, boolean>[] = []
            let possibleIndices: Indice[] = [...allIndices]
            
            let i = 0

            while (possibleIndices.length != 1){
                let tmpPossibleIndices: Indice[] = [...possibleIndices]
                let choosenPair : Pair<Person, boolean> = new Pair(personNetwork.getPersons()[0], true)
                for(const person of personNetwork.getPersons().filter((p) => p.getId() !== choosenPerson.getId())){
                    const veryTmpIndice = [...possibleIndices]
                    if (!choosenIndiceTester.Works(person)){
                        possibleIndices.forEach((possibleIndice, index) =>{
                            const tester = IndiceTesterFactory.Create(possibleIndice)
                            if (tester.Works(person)){
                                const t = veryTmpIndice.findIndex((tmpIndice) => tmpIndice.getId() == possibleIndice.getId())
                                if (t != -1){
                                    veryTmpIndice.splice(t, 1)
                                }
                            }
                        })
                        if (veryTmpIndice.length<tmpPossibleIndices.length){
                            tmpPossibleIndices = veryTmpIndice
                            choosenPair = new Pair(person, false)
                        }
                    }
                    else{
                        possibleIndices.forEach((possibleIndice, index) =>{
                            const tester = IndiceTesterFactory.Create(possibleIndice)
                            if (!tester.Works(person)){
                                const t = veryTmpIndice.findIndex((tmpIndice) => tmpIndice.getId() == possibleIndice.getId())
                                if (t != -1){
                                    veryTmpIndice.splice(t, 1)
                                }
                            }
                        })
                        if (veryTmpIndice.length<tmpPossibleIndices.length){
                            tmpPossibleIndices = veryTmpIndice
                            choosenPair = new Pair(person, true)
                        }
                    }
                }
                possibleIndices = [...tmpPossibleIndices]
                modifiedPersons.push(choosenPair)
                console.log(possibleIndices)
            }
            console.log("choosenIndice => " + choosenIndice.ToString("fr"))
            console.log("possibleIndices => " + possibleIndices[0].ToString("fr"))
            modifiedPersons.forEach((pair) =>{
                map.get(pair.first.getId())?.push(new Pair(choosenIndice, pair.second))
            })
        })
        return map
    }
}
export default EnigmeDuJourCreator