import { DataSet } from "vis-network";
import { colorToEmoji, positionToColor } from "../ColorHelper";
import Bot from "./Bot";
import IndiceTesterFactory from "./Factory/IndiceTesterFactory";
import NodePerson from "./Graph/NodePerson";
import Indice from "./Indices/Indice";
import Pair from "./Pair";
import Person from "./Person";
import PersonNetwork from "./PersonsNetwork";
import Player from "./Player";
import DefaultImg from "../res/img/bot.png"

class EasyBot extends Bot{

    constructor(id: string, pseudo: string, profilePicture: string){
        if (profilePicture === undefined || profilePicture === ""){
            profilePicture=DefaultImg
        }
        super(id, pseudo, profilePicture)
    }

    toJson() {
        return {
            type: "EasyBot",
            id: this.id,
            pseudo: this.pseudo,
            profilePicture: this.profilePicture
        };
    }

    playRound(personNetwork: PersonNetwork, players: Player[]): [number, number] {
        if (this.indice==undefined){
            return [-1, -1]
        }
        let rand = Math.random()
        const filterPlayers = players.filter((p) => p.id != this.id)
        if (rand < 0.75){
            const possibleCombinaison = new Map<number, number[]>()
            filterPlayers.forEach((p, index) =>{
                possibleCombinaison.set(index, [])
            })
            personNetwork.getPersons().forEach((p) =>{
                players.forEach((player, index) =>{
                    if (index!=this.index && (!this.actualNetwork.get(p)?.includes(new Pair(index, true) || !this.actualNetwork.get(p)?.includes(new Pair(index, false))))){
                        const t = possibleCombinaison.get(index)
                        if( t==undefined){
                            possibleCombinaison.set(index, [p.getId()])
                        }
                        else{
                            t.push(p.getId())
                        }
                    }
                })
            })
            let r = this.index
            while(r==this.index){
                r = Math.floor(Math.random() * players.length)
            }
            const tab = possibleCombinaison.get(r)
            if (tab!= undefined){
                const randIndex = Math.floor(Math.random() * tab.length)
                const tester = IndiceTesterFactory.Create(this.indice)
                const pers = personNetwork.getPersons().find((p) => p.getId() == tab[randIndex])
                if (pers != undefined)
                return [r, tab[randIndex]]
            }
        }
        else{
            const filterNodes = []
            const possibleNodes: number[] = []
            const indiceTester=IndiceTesterFactory.Create(this.indice)
            personNetwork.getPersons().forEach((p) => {
                let works = true
                for(let i = 0; i<players.length; i++){
                    if (!indiceTester.Works(p) || this.actualNetwork.get(p)?.includes(new Pair(i, false))){
                        works = false
                    }
                }
                if (works){
                    possibleNodes.push(p.getId())
                }
            });
            const index = possibleNodes[Math.floor(Math.random() * possibleNodes.length)]
            return [players.length, index]
        }
        return [-1, -1]
    }

    placeSquare(personNetwork: PersonNetwork, players: Player[]): number {
        const tabFilterPerson: Person[] = []
        if (this.indice == undefined){
            return -1
        }
        const indiceTester = IndiceTesterFactory.Create(this.indice)
        personNetwork.getPersons().forEach((p) =>{
            const tab = this.actualNetwork.get(p)
            if (!indiceTester.Works(p) && (!tab?.includes(new Pair(this.index, true) || !tab?.includes(new Pair(this.index, false))))){
                tabFilterPerson.push(p)
            }
        })
        return tabFilterPerson[Math.floor(Math.random() * tabFilterPerson.length)].getId()
    }

    newInformation(person: Person, playerIndex: number, works: boolean): void {
        this.actualNetwork.get(person)?.push(new Pair(playerIndex, works))
    }
    initiateMap(personNetwork: PersonNetwork): void {
        personNetwork.getPersons().forEach((p) =>{
            this.actualNetwork.set(p, [])
        })
    }

}

export default EasyBot