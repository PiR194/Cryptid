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
      socket.emit("ask player", nodeId, playerId, players.find((p) => p.id === socket.id, actualPlayerIndex))
    }
  }

  async function askEveryone(){
    if (nodeId !== null){
      //@ts-ignore
      const person = personNetwork?.getPersons().find((p) => p.getId() == nodeId)
      if (person != undefined){
        const indiceTester = IndiceTesterFactory.Create(indices[actualPlayerIndex])
        let nextPlayerIndex = actualPlayerIndex + 1
        if (nextPlayerIndex == players.length){
          nextPlayerIndex = 0
        }

        let playerIndex = actualPlayerIndex + 1
        if (indiceTester.Works(person)){
          socket.emit("node checked", nodeId, true, actualPlayerIndex, room, nextPlayerIndex)
          while(playerIndex != actualPlayerIndex){
            if (playerIndex == players.length){
              playerIndex = 0
            }
            const tester = IndiceTesterFactory.Create(indices[playerIndex])
            const works = tester.Works(person)
            await delay(500);
            socket.emit("asked all 1by1", person.getId(), players[playerIndex].id)
            socket.emit("node checked", nodeId, works, playerIndex, room, nextPlayerIndex)
            if(!works){
              return
            }
            playerIndex ++
          }
        }
      }
    }
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <div className="choice-bar-container">
      <h3 className="choice-bar-heading">Quel joueur voulez-vous interroger ?</h3>
      <div>
      <button className="choice-bar-button" onClick={async () => await askEveryone()} style={{ backgroundColor: theme.colors.primary }}>Tout le monde</button>
        {players.map((player, index) => (
          player.id !== socket.id &&
          <button key={index} className="choice-bar-button" onClick={() => askPlayer(player.id)} style={{ backgroundColor: theme.colors.primary }}>
            {player.pseudo}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceBar;