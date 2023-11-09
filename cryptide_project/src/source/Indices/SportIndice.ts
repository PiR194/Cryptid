import { SportToString } from "../EnumExtender";
import Sport from "../Sport";
import Indice from "./Indice";

class SportIndice extends Indice {
    private sports: Sport[]

    constructor(id: number, sports: Sport[]) {
      super(id);
      this.sports = sports
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let string =  "La personne pratique au moins un de ces sports: ";
      for (let i = 0; i<this.sports.length; i++){
        if (i==this.sports.length - 1 || this.sports.length == 1){
          string = string + " " + SportToString(this.sports[i], lang)
        }
        else{
          string = string + " ou " + SportToString(this.sports[i], lang)
        }
      }
      return string
    }


    getSports(): Sport[]{
      return this.sports
    }
  }

  export default SportIndice