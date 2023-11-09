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
      return "La personne a entre " + this.minimum + " et " + this.maximum + " ans"
    }


    getMinimum(): number{
      return this.minimum
    }

    getMaximum(): number{
      return this.maximum
    }
  }

  export default AgeIndice