import Color from "./Color";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";
import Sport from "./Sport";

class NetworkGenerator{

    static GenerateNetwork(nbPerson: number): PersonNetwork{
        const tabSports: Sport[] = [0, 1, 2, 3, 4, 5, 5, 5, 5]
        const tabColor: Color[] = [0, 1, 2, 3, 4]
        const tabJeune: number[] = []
        const tabAdo: number[] = []
        const tabAdulte: number[] = []
        const tabVieux: number[] = []

        const tabPerson: Person[] = []

        let id = 0
        for(let i = 0; i < nbPerson/4; i++){
            const nombreAleatoire = Math.floor(Math.random() * 14) + 1;
            tabJeune.push(nombreAleatoire)
        }
        for(let i = 0; i < nbPerson/4; i++){
            const nombreAleatoire = Math.floor(Math.random() * 5) + 15;
            tabAdo.push(nombreAleatoire)
        }
        for(let i = 0; i < nbPerson/4; i++){
            const nombreAleatoire = Math.floor(Math.random() * 10) + 20;
            tabAdulte.push(nombreAleatoire)
        }
        for(let i = 0; i < nbPerson/4; i++){
            const nombreAleatoire = Math.floor(Math.random() * 31) + 30;
            tabVieux.push(nombreAleatoire)
        }

        const tabAge: number[][] = [tabJeune, tabAdo, tabAdulte, tabVieux]

        let tmpTabSport=[...tabSports]
        let tmpTabColor = [...tabColor]
        for (let i = 0; i<nbPerson; i++){
            if (tmpTabColor.length == 0){
                tmpTabColor = [...tabColor]
            }
            let sports = []
            for (let j = 0; j < 3; j++){
                if (tmpTabSport.length == 0) tmpTabSport = [...tabSports]
                const rand = Math.floor(Math.random() * tmpTabSport.length)
                if (tmpTabSport[rand] != Sport.AUCUN){
                    sports.push(tmpTabSport[rand])
                }
                tmpTabSport.splice(rand, 1)
            }
            const randCol = Math.floor(Math.random() * tmpTabColor.length)
            const color = tmpTabColor[randCol]
            tmpTabColor.splice(randCol, 1)

            const randAge = Math.floor(Math.random() * tabAge.length)
            const randAge2 = Math.floor(Math.random() * tabAge[randAge].length)

            const age = tabAge[randAge][randAge2]
            tabAge[randAge].splice(randAge2, 1)
            if (tabAge[randAge].length == 0){
                tabAge.splice(randAge, 1)
            }
            tabPerson.push(new Person(i, i.toString(), age, color, sports, []))
        }
        return new PersonNetwork(tabPerson)
    }
}

export default NetworkGenerator