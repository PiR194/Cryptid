import Color from "./Color";
import Sport from "./Sport";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faBasketballBall } from '@fortawesome/free-solid-svg-icons';
import { parseJsonText } from "typescript";



function GetJsonFile(lang: string){
    const response = require(`../Translations/${lang}.json`);
    const data = response;
    return data
}
function ColorToString(color: Color, lang: string): string{
    let json = GetJsonFile(lang)
    switch(color){
        case Color.WHITE:
            return json.white
        case Color.BLACK:
            return json.black
        case Color.BLOND:
            return json.blond
        case Color.REDHEAD:
            return json.redhead
        case Color.BROWN:
            return json.brown
    }
}


function ColorToHexa(color: Color): string{
    switch(color){
        case Color.WHITE:
            return "#FFFFFF"
        case Color.BLACK:
            return "#000000"
        case Color.BLOND:
            return "#E2BC74"
        case Color.REDHEAD:
            return "#FF8B00"
        case Color.BROWN:
            return "#5B3C11"
    }
}

function ColorToColorFont(color: Color): string{
    switch(color){
        case Color.WHITE:
            return "#000000"
        case Color.BLACK:
            return "#FFFFFF"
        case Color.BLOND:
            return "#000000"
        case Color.REDHEAD:
            return "#000000"
        case Color.BROWN:
            return "#FFFFFF"
    }
}


function SportToString(sport: Sport, lang: string): string{
    let json = GetJsonFile(lang)
    switch(sport){
        case Sport.FOOT:
            return json.football
        case Sport.BASEBALL:
            return json.baseball
        case Sport.BASKET:
            return json.basketball
        case Sport.TENNIS:
            return json.tennis
        case Sport.BOWLING:
            return json.bowling
        case Sport.AUCUN:
            return ""
    }
}



function SportToIcon(sport: Sport): string{
    switch(sport){
        case Sport.FOOT:
            return "⚽" 
        case Sport.BASEBALL:
            return "⚾"
        case Sport.BASKET:
            return "🏀"
        case Sport.TENNIS:
            return "🎾"
        case Sport.BOWLING:
            return "🎳"
        case Sport.AUCUN:
            return ""
    }
}
export {ColorToString, SportToString, ColorToHexa, ColorToColorFont, SportToIcon, GetJsonFile}
