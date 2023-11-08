import Sport from "../Sport";
import Indice from "./Indice";

class SportIndice extends Indice {
    private sports: Sport[]

    constructor(id: number, sports: Sport[]) {
      super(id);
      this.sports = sports
    }
  
    // Implémentation de la méthode abstraite
    ToString(): string {
      return "La personne a entre "
    }


    getSports(): Sport[]{
      return this.sports
    }
  }

  export default SportIndice