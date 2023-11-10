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
}

export default PersonNetwork