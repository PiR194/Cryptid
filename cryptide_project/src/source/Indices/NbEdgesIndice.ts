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
    ToString(): string {
      return "La personne a au moins " + this.nbNeighbors + " amis";
    }
  }

  export default NbEdgesIndice