import { GetJsonFile } from "../EnumExtender";
import Indice from "./Indice";

class NbSportIndice extends Indice {
    private nbSport: number[];

    constructor(id: number, nbSport: number[]) {
      super(id);
      this.nbSport = nbSport;
    }

    public getNbSport(): number[]{
      return this.nbSport
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let json = GetJsonFile(lang)
      let string = `${json.nb_sports_indice_start} `;
      this.nbSport.forEach((i, index) =>{
        if (index == this.nbSport.length - 1){
          string += i
        }
        else{
          string += ` ${i} ${json.or} `
        }
      })
      return string + ` ${json.nb_sports_indice_end}`
    }

    toJSON() {
      return {
          type: "NbSportIndice",
          id: this.id,
          nbSport: this.nbSport,
      };
    }
  }

  export default NbSportIndice