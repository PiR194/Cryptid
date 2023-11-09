import Edge from "./Edge";
import NodePerson from "./NodePerson";

class GraphPerson{

    public edges: Edge[]

    public nodesPerson: NodePerson[]

    constructor(edges: Edge[], nodesPerson: NodePerson[]){
        this.edges = edges
        this.nodesPerson = nodesPerson
    }

}

export default GraphPerson