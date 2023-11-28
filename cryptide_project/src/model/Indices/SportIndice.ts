import { GetJsonFile, SportToString } from "../EnumExtender";
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
      let json = GetJsonFile(lang)
      let string =  json.sport_start;
      for (let i = 0; i<this.sports.length; i++){
        if (i==this.sports.length - 1 || this.sports.length == 1){
          string = `${string} ${SportToString(this.sports[i], lang)} `
        }
        else{
          string = `${string} ${SportToString(this.sports[i], lang)} ${json.or_sport} `
        }
      }
      return `${string} ${json.sport_end}` 
    }


    getSports(): Sport[]{
      return this.sports
    }

    toJSON() {
      return {
          type: "SportIndice",
          id: this.id,
          sports: this.sports,
      };
    }
  }

  export default SportIndice