import Indice from "../Indices/Indice"
import Person from "../Person"

interface IndiceTester{

    Works(person: Person): boolean
    TestWorks(person: Person): boolean
}

export default IndiceTester