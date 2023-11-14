import Color from "../Color";
import { ColorToString, GetJsonFile } from "../EnumExtender";
import Indice from "./Indice";

class ColorIndice extends Indice {
    private colors: Color[]

    constructor(id: number, colors: Color[]) {
      super(id);
      this.colors = colors
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let json = GetJsonFile(lang)
      let string =  json.color_start;
      for (let i = 0; i<this.colors.length; i++){
        if (i==this.colors.length - 1 || this.colors.length == 1){
          string = `${string} ${ColorToString(this.colors[i], lang)}`
        }
        else{
          string = `${string} ${ColorToString(this.colors[i], lang)} ${json.or}`
        }
      }
      return `${string} ${json.color_end}` 
    }

    getColors(): Color[]{
      return this.colors
    }

    toJSON() {
      return {
          type: "ColorIndice",
          id: this.id,
          colors: this.colors,
      };
    }
  }
  

  export default ColorIndice