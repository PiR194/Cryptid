import React, { useEffect, useState } from 'react';
import { useTheme } from '../Style/ThemeContext';
import Player from '../model/Player';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
interface LobbyContainerProps {
        roomNum : string
        HeadPlayer : Player
        nbPlayer : number
    //? mettre un "nbplayermax" si le nombre de joueur max peut etre fixé ?
}

const LobbyContainer: React.FC<LobbyContainerProps> = ({roomNum, HeadPlayer, nbPlayer}) => {
    const theme=useTheme();

    const navigate = useNavigate();
    const dest = '/lobby?room=' + roomNum;

    const handleContainerClick = () => {
        if (nbPlayer < 6) {
            navigate(dest);
        } else {
            alert('La salle est pleine. Impossible de rejoindre.');
        }
    };


    return(
        <div className='lobbyMainContainer' onClick={handleContainerClick}>
                <header style={{height:'20%', display:'flex', justifyContent:'end'}}>
                    <h6><i>Room : {roomNum}</i></h6>
                </header>
                <hr/>
                    <h3><u>{HeadPlayer.pseudo}</u></h3>
                <div style={{display:'flex', justifyContent:'end', alignItems:'end'}}>
                    <h2>{nbPlayer}/6</h2>
                </div>
        </div>
    );
}

export default LobbyContainer;
