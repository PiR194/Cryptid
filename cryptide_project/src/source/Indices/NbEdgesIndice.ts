import { GetJsonFile } from "../EnumExtender";
import EdgesIndice from "./EdgesIndice";

class NbEdgesIndice extends EdgesIndice {
    private nbNeighbors: number;

    constructor(id: number, nbNeighbors: number) {
      super(id);
      this.nbNeighbors = nbNeighbors;
    }

    public getNbEdges(): number{
      return this.nbNeighbors
    }
  
    // Implémentation de la méthode abstraite
    ToString(lang: string): string {
      let json = GetJsonFile(lang)
      return `${json.nb_friends_indice_start} ${this.nbNeighbors} ${json.nb_friends_indice_end}`;
    }
  }

  export default NbEdgesIndice