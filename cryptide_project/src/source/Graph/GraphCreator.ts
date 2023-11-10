import Edge from "./Edge";
import { ColorToColorFont, ColorToHexa, SportToIcon, SportToString } from "../EnumExtender";
import GraphPerson from "./GraphPerson";
import NodePerson from "./NodePerson";
import PersonNetwork from "../PersonsNetwork";
import Font from "./Font";

class GraphCreator{

    static CreateGraph(network: PersonNetwork): GraphPerson{
        const nodesPerson : NodePerson[] = []
        const edges: Edge[] = []
        network.getPersons().forEach((p) =>{
            let label = p.getName() + "\n" + p.getAge() + "\n"
            for (let i = 0; i<p.getSports().length; i++){
                label += SportToIcon(p.getSports()[i])
            }
            label += "\n"

            
            const nodePerson = new NodePerson(p.getId(), label, p.getColor(), new Font(ColorToColorFont(p.getColor()), 14, 'center'), 'box')
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