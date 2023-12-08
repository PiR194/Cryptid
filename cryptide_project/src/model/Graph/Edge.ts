class Edge{
    
    public from: number
    public to: number
    public color: string = "black"
    
    constructor(from: number, to: number){
        this.from = from
        this.to = to
    }
}

export default Edge