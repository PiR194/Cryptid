import Indice from "../Indices/Indice";
import Person from "../Person";
import PersonNetwork from "../PersonsNetwork";

interface IndiceEdgesCreator{
    createWorkingEdges(personNetwork: PersonNetwork, person: Person, indices: Indice[]): number
}

export default IndiceEdgesCreator