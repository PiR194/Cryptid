abstract class Indice {
    protected id: number;
  
    constructor(id: number) {
      this.id = id;
    }
  
    // Getter and setter for id
    getId(): number {
      return this.id;
    }
  
    setId(id: number): void {
      this.id = id;
    }
  
    // Méthode abstraite pour être implémentée par les classes dérivées
    abstract ToString(lang: string): string;

    abstract toJSON(): any

  }

    //todo to string ?
  
export default Indice
