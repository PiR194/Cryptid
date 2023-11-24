import React, { useEffect, useState } from 'react';
import ProfilePDP from '../Components/ProfilePDP';

import './Profile.css'


import SessionService from '../services/SessionService';
import { PlayerProps } from '../types/Player';
import { update } from 'lodash';

//@ts-ignore
const Profile = () => {
  
  //let player;
  const [player, setPlayer] = useState<PlayerProps | null>(null);
  //! useeffect pour l'instant, il faudra voir pour changer la facons de prendre une session
  useEffect(() => {
    const fetchUserInformation = async () => {
        try {
            const sessionData = await SessionService.getSession();
            if (sessionData.user) {
                const updatedPlayer: PlayerProps = {
                    pseudo: sessionData.user.pseudo,
                    profilePicture: sessionData.user.profilePicture,
                    soloStats: {
                        nbGames: sessionData.user.soloStats.nbGames,
                        bestScore: sessionData.user.soloStats.bestScore,
                        avgNbTry: sessionData.user.soloStats.avgNbTry,
                    },
                    onlineStats: {
                        nbGames: sessionData.user.onlineStats.nbGames,
                        nbWins: sessionData.user.onlineStats.nbWins,
                        ratio: sessionData.user.onlineStats.ratio,
                    },
                };
                setPlayer(updatedPlayer);
            }
          } catch (error) {
            console.error(error);
        }
    }})

  return (
    <div className='mainContainer'>
      <ProfilePDP player={player}/>
      <h1> {player?.pseudo} </h1>
    </div>
  );
};

export default Profile;
