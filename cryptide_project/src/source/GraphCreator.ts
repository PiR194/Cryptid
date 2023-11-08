import Edge from "./Edge";
import GraphPerson from "./GraphPerson";
import NodePerson from "./NodePerson";
import PersonNetwork from "./PersonsNetwork";

class GraphCreator{

    static CreateGraph(network: PersonNetwork): GraphPerson{
        const nodesPerson : NodePerson[] = []
        const edges: Edge[] = []
        network.getPersons().forEach((p) =>{
            const nodePerson = new NodePerson(p.getId(), p.getName())
            nodesPerson.push(nodePerson)
            p.getFriends().forEach((f) =>{
                if(edges.some(edge => (edge.from === f.getId() && edge.to === p.getId()) || (edge.from === p.getId() && edge.to === f.getId()))){
                    return;
                }
                edges.push(new Edge(p.getId(), f.getId()))
            });
        });

        return new GraphPerson(edges, nodesPerson)
    }
}

export default GraphCreator