import Person from "./Person";

class PersonNetwork{
    private persons : Person[]

    constructor(persons: Person[]){
        this.persons = persons;
    }

    getPersons(): Person[]{
        return this.persons;
    }

    setPersons(persons: Person[]){
        this.persons = persons
    }

    addPerson(person: Person){
        this.persons.push(person)
    }

    private dfs(startNode: Person, visited: Set<number>) {
        visited.add(startNode.getId());
    
        for (const friend of startNode.getFriends()) {
          if (!visited.has(friend.getId())) {
            this.dfs(friend, visited);
          }
        }
    }

    getConnectivityDetails(): [boolean, Person[], Person[]] {
        if (this.persons.length === 0) {
          // Si la liste de personnes est vide, le graphe est considéré comme connexe.
          return [true, [], []]
        }
    
        const visited: Set<number> = new Set();
        const connectedNodes: Person[] = [];
    
        // Commencez la recherche en profondeur à partir du premier nœud du réseau.
        this.dfs(this.persons[0], visited);
    
        // Obtenez les nœuds connectés.
        for (const person of this.persons) {
          if (visited.has(person.getId())) {
            connectedNodes.push(person);
          }
        }
    
        // Obtenez les nœuds non connectés.
        const unconnectedNodes: Person[] = this.persons.filter(person => !visited.has(person.getId()));
    
        return [unconnectedNodes.length === 0, connectedNodes, unconnectedNodes];
    }
}

export default PersonNetwork