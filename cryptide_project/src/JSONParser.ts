import EasyBot from "./model/EasyBot";
import Human from "./model/User";
import AgeIndice from "./model/Indices/AgeIndice";
import ColorEdgesIndice from "./model/Indices/ColorEdgesIndice";
import ColorIndice from "./model/Indices/ColorIndice";
import Indice from "./model/Indices/Indice";
import NbEdgesIndice from "./model/Indices/NbEdgesIndice";
import NbSportIndice from "./model/Indices/NbSportIndice";
import SportIndice from "./model/Indices/SportIndice";
import Person from "./model/Person";
import PersonNetwork from "./model/PersonsNetwork";
import Player from "./model/Player";
import User from "./model/User";
import NodePerson from "./model/Graph/NodePerson";
import Font from "./model/Graph/Font";

class JSONParser{

    static JSONToNetwork(jsonString: any): PersonNetwork{
        const json = JSON.parse(jsonString)
        const persons: Person[] = []
        const personFriends = new Map<number, number[]>()
        json.persons.forEach((personJson: any) => {
            persons.push(JSONParser.JSONToPerson(personJson))
            personJson.friends.forEach((f: any) => {
                if (personFriends.get(personJson.id) == undefined){
                    personFriends.set(personJson.id, [f.id])
                }
                else{
                    personFriends.get(personJson.id)?.push(f.id)
                }
            });
        });

        for(const person of persons){
            const tab = personFriends.get(person.getId())
            if (tab != undefined){
                for(const i of tab){
                    person.addFriend(persons.filter((p) => p.getId() == i)[0])
                }
            }
        }

        return new PersonNetwork(persons);
    }

    static JSONToPerson(json: any): Person {
        const person = new Person(
            json.id,
            json.name,
            json.age,
            json.color,
            json.sports,
            []
        );
        return person;
    }


    static JSONToIndice(json: any): Indice{
        switch (json.type){
            case "AgeIndice":
                return new AgeIndice(json.id, json.minimum, json.maximum)
            case "ColorEdgesIndice":
                return new ColorEdgesIndice(json.id, json.neighborsColors)
            case "ColorIndice":
                return new ColorIndice(json.id, json.colors)
            case "NbEdgesIndice":
                return new NbEdgesIndice(json.id, json.nbNeighbors)
            case "NbSportIndice":
                return new NbSportIndice(json.id, json.nbSport)
            case "SportIndice":
                return new SportIndice(json.id, json.sports)
            default:
                throw new Error("PARSER unable to parse indice: " + json.type);
        }
    }

    static JSONToIndices(jsonString: any): Indice[]{
        const json = JSON.parse(jsonString)
        const tabIndice: Indice[] = []
        json.forEach((i: any) => {
            tabIndice.push(this.JSONToIndice(i))
        });
        return tabIndice
    }

    static JSONToPlayer(json: any): Player{
        switch (json.type){
            case "User":
                return new User(json.id, json.pseudo, json.profilePicture, json.mastermindStats, json.easyEnigmaStats, json.mediumEnigmaStats ,json.hardEnigmaStatsS, json.onlineStats)
            case "EasyBot":
                return new EasyBot(json.id, json.pseudo, json.profilePicture)
            default:
                throw new Error("PARSER unable to parse player: " + json.type);
        }
    }


    static JSONToNodePersons(json: any): NodePerson[]{
        const tmpTab: NodePerson[] = []
        json.forEach((element: any) => {
            tmpTab.push(new NodePerson(element.id, element.label, element.color, new Font(element.font.color, element.font.size, element.font.align), element.shape))
        });
        return tmpTab
    }
}

export default JSONParser