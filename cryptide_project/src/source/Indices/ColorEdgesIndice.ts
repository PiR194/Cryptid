import Color from "../Color";
import EdgesIndice from "./EdgesIndice";

class ColorEdgesIndice extends EdgesIndice {
    private neighborsColors: Color[];

    constructor(id: number, neighborsColors: Color[]) {
      super(id);
      this.neighborsColors = neighborsColors;
    }

    public getColors(): Color[]{
      return this.neighborsColors
    }
  
    // Implémentation de la méthode abstraite
    ToString(): string {
      return "La personne a au moins " + this.neighborsColors + " amis";
    }
  }

  export default ColorEdgesIndice