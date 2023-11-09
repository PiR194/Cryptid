import Color from "../Color";
import { ColorToString } from "../EnumExtender";
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
    ToString(lang: string): string {
      let string =  "La personne a au moins un ami avec les cheveux";
      for (let i = 0; i<this.neighborsColors.length; i++){
        if (i==this.neighborsColors.length - 1 || this.neighborsColors.length == 1){
          string = string + " " + ColorToString(this.neighborsColors[i], lang)
        }
        else{
          string = string + " ou " + ColorToString(this.neighborsColors[i], lang)
        }
      }
      return string
    }
  }

  export default ColorEdgesIndice