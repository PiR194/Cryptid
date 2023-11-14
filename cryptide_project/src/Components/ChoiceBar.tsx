import React from 'react';
import { useGame } from '../Contexts/GameContext';
import { socket } from '../SocketConfig';
import './ChoiceBar.css';
import { useTheme } from '../Style/ThemeContext';

const ChoiceBar = () => {
  const { players, nodeId } = useGame();

  function askPlayer(playerId: string){
    if (nodeId !== null){
      socket.emit("ask player", nodeId, playerId, players.find((p) => p.id === socket.id))
    }
  }

  return (
    <div className="choice-bar-container">
      <h3 className="choice-bar-heading">Quel joueur voulez-vous interroger ?</h3>
      <div>
        {players.map((player, index) => (
          player.id !== socket.id &&
          <button key={index} className="choice-bar-button" onClick={() => askPlayer(player.id)}>
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceBar;