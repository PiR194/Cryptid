import React, { useEffect, useState } from 'react';
import ProfilePDP from '../Components/ProfilePDP';

import './Profile.css'


import SessionService from '../services/SessionService';
import { PlayerProps } from '../types/Player';
import { update } from 'lodash';
import User from '../model/User';
import { socket } from '../SocketConfig';
import { useAuth } from '../Contexts/AuthContext';


//@ts-ignore
const Profile = () => {
  
  //let player;
  const {user} = useAuth()

  //! useeffect pour l'instant, il faudra voir pour changer la facons de prendre une session

  return (
    <div className='mainContainer'>
      <ProfilePDP/>
      <h1> {user?.pseudo} </h1>
    </div>
  );
};

export default Profile;
