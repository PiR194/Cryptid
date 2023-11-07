import EdgesIndice from "./EdgesIndice";

class NbEdgesIbndice extends EdgesIndice {
    private nbNeighbors: number;

    constructor(id: number, nbNeighbors: number) {
      super(id);
      this.nbNeighbors = nbNeighbors;
    }
  
    // Implémentation de la méthode abstraite
    ToString(): string {
      return "La personne a au moins " + this.nbNeighbors + " amis";
    }
  }

  export default NbEdgesIbndice