import Color from "./Color";
import Sport from "./Sport";

function ColorToString(color: Color, lang: string): string{
    switch(color){
        case Color.BLANC:
            switch(lang){
                case "en":
                    return "White"
                default:
                    return "Blanc" 
            }
        case Color.NOIR:
            switch(lang){
                case "en":
                    return "Black"
                default:
                    return "Noir" 
            }
        case Color.BLOND:
            switch(lang){
                case "en":
                    return "Blond"
                default:
                    return "Blond" 
            }
        case Color.ROUX:
            switch(lang){
                case "en":
                    return "Redhead"
                default:
                    return "Roux" 
            }
        case Color.BRUN:
            switch(lang){
                case "en":
                    return "Brown"
                default:
                    return "Brun" 
            }
    }
}


function ColorToHexa(color: Color): string{
    switch(color){
        case Color.BLANC:
            return "#FFFFFF"
        case Color.NOIR:
            return "#000000"
        case Color.BLOND:
            return "#E2BC74"
        case Color.ROUX:
            return "#FF8B00"
        case Color.BRUN:
            return "#5B3C11"
    }
}

function ColorToColorFont(color: Color): string{
    switch(color){
        case Color.BLANC:
            return "#000000"
        case Color.NOIR:
            return "#FFFFFF"
        case Color.BLOND:
            return "#000000"
        case Color.ROUX:
            return "#000000"
        case Color.BRUN:
            return "#FFFFFF"
    }
}


function SportToString(sport: Sport, lang: string): string{
    switch(sport){
        case Sport.FOOT:
            switch(lang){
                case "en":
                    return "Football"
                default:
                    return "Football" 
            }
        case Sport.RUGBY:
            switch(lang){
                case "en":
                    return "Rugby"
                default:
                    return "Rugby" 
            }
        case Sport.BASKET:
            switch(lang){
                case "en":
                    return "Basket"
                default:
                    return "Basket" 
            }
        case Sport.TENNIS:
            switch(lang){
                case "en":
                    return "Tennis"
                default:
                    return "Tennis" 
            }
        case Sport.CURLING:
            switch(lang){
                case "en":
                    return "Curling"
                default:
                    return "Curling" 
            }
        case Sport.AUCUN:
            return ""
    }
}

export {ColorToString, SportToString, ColorToHexa, ColorToColorFont}
