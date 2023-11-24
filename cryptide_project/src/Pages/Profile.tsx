import React, { useEffect, useState } from 'react';
import ProfilePDP from '../Components/ProfilePDP';

import './Profile.css'


import SessionService from '../services/SessionService';
import { PlayerProps } from '../types/Player';
import { update } from 'lodash';
import Human from '../model/Human';

//@ts-ignore
const Profile = () => {
  
  //let player;
  const [player, setPlayer] = useState<Human>(new Human("null", "nullHuman"));
  //! useeffect pour l'instant, il faudra voir pour changer la facons de prendre une session
  useEffect(() => {
    const fetchUserInformation = async () => {
        try {
            const sessionData = await SessionService.getSession();
            if (sessionData.user) {
                const updatedPlayer: Human = {
                  name: sessionData.user.pseudo,
                  pdp: sessionData.user.profilePicture,
                  toJson: function (): { type: string; id: string; name: string; } {
                    throw new Error('Function not implemented.');
                  },
                  id: ''
                };
                setPlayer(updatedPlayer);
            }
          } catch (error) {
            console.error(error);
        }
      }
      fetchUserInformation();
    }, []
  )

  return (
    <div className='mainContainer'>
      <ProfilePDP player={player}/>
      <h1> {player.name} </h1>
    </div>
  );
};

export default Profile;
