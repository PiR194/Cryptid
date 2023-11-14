import React from 'react';
import { useGame } from '../Contexts/GameContext';
import { socket } from '../SocketConfig';
import './ChoiceBar.css';
import { useTheme } from '../Style/ThemeContext';
import IndiceTesterFactory from '../model/Factory/IndiceTesterFactory';
import { positionToColor } from '../ColorHelper';

const ChoiceBar = () => {
  const { players, nodeId, actualPlayerIndex, personNetwork, indices, room } = useGame();
  const theme = useTheme();


  function askPlayer(playerId: string){
    if (nodeId !== null){
      console.log("CLICK")
      socket.emit("ask player", nodeId, playerId, players.find((p) => p.id === socket.id))
    }
  }

  function askEveryone(){
    if (nodeId !== null){
      const person = personNetwork?.getPersons().find((p) => p.getId() == nodeId)
      if (person != undefined){
        const indiceTester = IndiceTesterFactory.Create(indices[actualPlayerIndex])
        let playerIndex = actualPlayerIndex + 1
        if (indiceTester.Works(person)){
          socket.emit("node checked", nodeId, true, positionToColor(actualPlayerIndex), room, actualPlayerIndex + 1)
          while(playerIndex != actualPlayerIndex){
            const tester = IndiceTesterFactory.Create(indices[playerIndex])
            const works = tester.Works(person)
            socket.emit("node checked", nodeId, works, positionToColor(playerIndex), room, actualPlayerIndex + 1)
            if (!works){
              break
            }
            playerIndex ++
            if (playerIndex == players.length){
              playerIndex = 0
            }
          }
        }
        else{
          console.log("Ne marche pas")
          console.log(person)
        }
      }
      console.log("CLICK")
      //socket.emit("ask player", nodeId, playerId, players.find((p) => p.id === socket.id))
    }
  }

  return (
    <div className="choice-bar-container">
      <h3 className="choice-bar-heading">Quel joueur voulez-vous interroger ?</h3>
      <div>
      <button className="choice-bar-button" onClick={() => askEveryone()} style={{ backgroundColor: theme.colors.primary }}>Tout le monde</button>
        {players.map((player, index) => (
          player.id !== socket.id &&
          <button key={index} className="choice-bar-button" onClick={() => askPlayer(player.id)} style={{ backgroundColor: theme.colors.primary }}>
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceBar;