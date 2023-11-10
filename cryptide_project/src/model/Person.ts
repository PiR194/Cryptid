import Sport from "./Sport";
import Color from "./Color";

class Person {
    private id: number;
    private name: string;
    private age: number;
    private color: Color;
    private sports: Sport[];
    private friends: Person[];
  
    constructor(id: number, name: string, age: number, color: Color, sports: Sport[], friends: Person[]) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.color = color;
      this.sports = sports;
      this.friends = friends;
    }
  
    getId(): number {
        return this.id;
      }
    
      setId(id: number): void {
        this.id = id;
      }
    
      // Getter and setter for name
      getName(): string {
        return this.name;
      }
    
      setName(name: string): void {
        this.name = name;
      }
    
      // Getter and setter for age
      getAge(): number {
        return this.age;
      }
    
      setAge(age: number): void {
        this.age = age;
      }
    
      // Getter and setter for color
      getColor(): Color {
        return this.color;
      }
    
      setColor(color: Color): void {
        this.color = color;
      }
    
      // Getter and setter for sports
      getSports(): Sport[] {
        return this.sports;
      }

      addSport(sport: Sport): void {
        this.sports.push(sport)
      }
    
      setSports(sports: Sport[]): void {
        this.sports = sports;
      }
    
      // Getter and setter for friends
      getFriends(): Person[] {
        return this.friends;
      }
    
      addFriend(friend: Person): void {
        this.friends.push(friend);
      }

      setFriends(friends: Person[]): void {
        this.friends = friends;
      }
}

export default Person
