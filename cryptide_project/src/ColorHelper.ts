import Player from "./model/Player";
import { socket } from "./SocketConfig";

function positionToColor(pos: number): string{
    switch (pos) {
      case 0:
        return "blue";
      case 1:
        return "green";
      case 2:
        return "yellow";
      case 3:
        return "purple";
      case 4:
        return "red";
      default:
        return "brown";
    }
}

function colorToEmoji(color: string, works: boolean): string{
  if (works){
    switch (color) {
      case "blue":
        return "🔵";
      case "green":
        return "🟢";
      case "yellow":
        return "🟡"; 
      case "purple":
        return "🟣"; 
      case "red":
        return "🔴";
      default:
        return "🟤"; 
    }
  }
  else{
    switch (color) {
      case "blue":
        return "🟦";
      case "green":
        return "🟩"; 
      case "yellow":
        return "🟨";
      case "purple":
        return "🟪"; 
      case "red":
        return "🟥";
      default:
        return "🟫"; 
    }    
  }
}



function positionToEmoji(pos: number, works: boolean): string{
  if (works){
    switch (pos) {
      case 0:
        return "🔵";
      case 1:
        return "🟢";
      case 2:
        return "🟡"; 
      case 3:
        return "🟣"; 
      case 4:
        return "🔴";
      default:
        return "🟤"; 
    }
  }
  else{
    switch (pos) {
      case 0:
        return "🟦";
      case 1:
        return "🟩"; 
      case 2:
        return "🟨";
      case 3:
        return "🟪"; 
      case 4:
        return "🟥";
      default:
        return "🟫"; 
    }    
  }
}

export {colorToEmoji, positionToColor, positionToEmoji}
