import Color from "../Color";
import { ColorToString } from "../EnumExtender";
import Indice from "./Indice";

class ColorIndice extends Indice {
    private colors: Color[]

    constructor(id: number, colors: Color[]) {
      super(id);
      this.colors = colors
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let string =  "La personne a au moins un ami avec les cheveux";
      for (let i = 0; i<this.colors.length; i++){
        if (i==this.colors.length - 1 || this.colors.length == 1){
          string = string + " " + ColorToString(this.colors[i], lang)
        }
        else{
          string = string + " ou " + ColorToString(this.colors[i], lang)
        }
      }
      return string
    }

    getColors(): Color[]{
      return this.colors
    }
  }

  export default ColorIndice