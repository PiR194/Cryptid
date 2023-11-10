import { GetJsonFile } from "../EnumExtender";
import Indice from "./Indice";

class AgeIndice extends Indice {
    private maximum: number;
    private minimum: number;

    constructor(id: number, minimum: number, maximum: number) {
      super(id);
      this.minimum = minimum;
      this.maximum = maximum;
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let json = GetJsonFile(lang)
      if (this.maximum > 100){
        return `${json.age_indice_more_start} ${this.minimum} ${json.age_indice_end}`
      }
      return `${json.age_indice_start} ${this.minimum} ${json.and} ${this.maximum} ${json.age_indice_end}`
    }


    getMinimum(): number{
      return this.minimum
    }

    getMaximum(): number{
      return this.maximum
    }
  }

  export default AgeIndice