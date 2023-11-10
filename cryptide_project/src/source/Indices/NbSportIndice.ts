import { GetJsonFile } from "../EnumExtender";
import Indice from "./Indice";

class NbSportIndice extends Indice {
    private nbSport: number;

    constructor(id: number, nbSport: number) {
      super(id);
      this.nbSport = nbSport;
    }

    public getNbSport(): number{
      return this.nbSport
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let json = GetJsonFile(lang)
      return `${json.nb_sports_indice_start} ${this.nbSport} ${json.nb_sports_indice_end}`;
    }
  }

  export default NbSportIndice