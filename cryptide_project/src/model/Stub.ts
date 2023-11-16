import Color from "./Color"
import AgeIndice from "./Indices/AgeIndice"
import ColorEdgesIndice from "./Indices/ColorEdgesIndice"
import ColorIndice from "./Indices/ColorIndice"
import Indice from "./Indices/Indice"
import NbEdgesIndice from "./Indices/NbEdgesIndice"
import NbSportIndice from "./Indices/NbSportIndice"
import SportIndice from "./Indices/SportIndice"
import Sport from "./Sport"

class Stub{

    static GenerateIndice(): Indice[]{
        let indice = new NbEdgesIndice(1, 2)
        let indice1 = new NbEdgesIndice(2, 3)
        let indice2 = new NbEdgesIndice(3, 4)
        let ageIndice = new AgeIndice(4, 0, 14)
        let ageIndice1 = new AgeIndice(5, 15, 19)
        let ageIndice2 = new AgeIndice(6, 20, 29)
        let ageIndice3 = new AgeIndice(7, 30, 100000)

        let indices: Indice[] = [indice, indice1, indice2, ageIndice, ageIndice1, ageIndice2, ageIndice3]

        let test = 8
        for (let i: Color=0; i<5; i++){
            for (let j: Color=0; j<5; j++){
                if (j==i){
                    continue
                }
                indices.push(new ColorIndice(test, [i, j]))
                test++
            }
        }

        for (let i: Sport=0; i<5; i++){
            for (let j: Sport=0; j<5; j++){
                if (j==i){
                    continue
                }
                indices.push(new SportIndice(test, [i, j]))
                test++
            }
        }

        for (let i: Color=0; i<5; i++){
            indices.push(new ColorEdgesIndice(test, [i]))
            test++
        }

        for (let i=1; i<3; i++){
            for (let j=0; j<3; j++){
                if (j==i){
                    continue
                }
                indices.push(new NbSportIndice(test, [i, j]))
                test++
            }
            
        }
        return indices
    }
}

export default Stub