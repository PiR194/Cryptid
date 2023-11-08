import Color from "../Color";
import Indice from "./Indice";

class ColorIndice extends Indice {
    private colors: Color[]

    constructor(id: number, colors: Color[]) {
      super(id);
      this.colors = colors
    }
  
    // Implémentation de la méthode abstraite
    ToString(): string {
      return "La personne a entre "
    }


    getColors(): Color[]{
      return this.colors
    }
  }

  export default ColorIndice