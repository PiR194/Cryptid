class Pair<T1, T2>{
    public first: T1
    public second: T2

    constructor(first: T1, second: T2){
        this.first=first
        this.second=second
    }

    equals(other: Pair<T1, T2>): boolean {
        return this.first === other.first && this.second === other.second;
    }
}

export default Pair