import Color from "../Color";
import { ColorToString, GetJsonFile } from "../EnumExtender";
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
      let json = GetJsonFile(lang)
      let string =  json.color_edges_start;
      for (let i = 0; i<this.neighborsColors.length; i++){
        if (i==this.neighborsColors.length - 1 || this.neighborsColors.length == 1){
          string = `${string} ${ColorToString(this.neighborsColors[i], lang)}`
        }
        else{
          string = `${string} ${ColorToString(this.neighborsColors[i], lang)} ${json.or}`
        }
      }
      return `${string} ${json.color_edges_end}` 
    }

    toJSON() {
      return {
          type: "ColorEdgesIndice",
          id: this.id,
          neighborsColors: this.neighborsColors,
      };
    }
  }

  export default ColorEdgesIndice