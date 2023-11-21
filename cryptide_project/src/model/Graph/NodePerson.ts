import Color from "../Color"
import { ColorToColorFont, ColorToHexa } from "../EnumExtender"
import Font from "./Font"

class NodePerson{
    public id: number
    public label: string
    public color: string
    public font: Font
    public shape: string
    public shadow: boolean = true
    public opacity: number = 1

    constructor(id: number, label: string, color: Color, font: Font, shape: string){
        this.id=id
        this.label=label
        this.color=ColorToHexa(color)
        this.font=font
        this.shape = shape
    }
}

export default NodePerson