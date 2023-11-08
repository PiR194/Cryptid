import Edge from "./Edge";
import NodePerson from "./NodePerson";

class GraphPerson{

    private edges: Edge[]

    private nodesPerson: NodePerson[]

    constructor(edges: Edge[], nodesPerson: NodePerson[]){
        this.edges = edges
        this.nodesPerson = nodesPerson
    }

}

export default GraphPerson