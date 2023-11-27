import React, { useEffect, useState } from 'react';
import ProfilePDP from '../Components/ProfilePDP';

import SessionService from '../services/SessionService';
import { PlayerProps } from '../types/Player';
import { update } from 'lodash';
import { socket } from '../SocketConfig';

/* Style */
import './Profile.css'
import Edit from "../res/icon/edit-pen.png"
import Coche from '../res/icon/coche.png'
import Cancel from '../res/icon/cancel.png'

/* Model */
import User from '../model/User';

/* Context */
import { useAuth } from '../Contexts/AuthContext';

/* Boostrap */
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

//@ts-ignore
const Profile = () => {
  
  
  //let player;
  const {user} = useAuth()
  
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.pseudo);

  //@ts-ignore
  const onUsernameChange = (newUsername) => {
    console.log("nouveau pseudo : " + newUsername)
    if(user?.pseudo != null){
      user.pseudo = newUsername;
    }
  }

  const handleUsernameChange = () => {
    // Maj du pseudo
    onUsernameChange(newUsername);

    // Désactiver le mode d'édition
    setEditingUsername(false);
  };


  //* Gestion Modal de suppression :
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Confirmation avec la phrase :
  const [confirmationPhrase, setConfirmationPhrase] = useState('');

  //@ts-ignore
  const handleConfirmationPhraseChange = (e) => {
    setConfirmationPhrase(e.target.value);
  };
  
  const handleDeleteAccount = () => {
    // Verification de la phrase
    if (confirmationPhrase.toLowerCase() === 'supprimer mon compte') {
      console.log('Compte supprimé !');
      handleCloseDeleteModal();
    } else {
      console.error('Phrase de confirmation incorrecte.');
    }
  };

  
  return (
    <>
    <center><h1>Mon Compte</h1></center>
    <div className='mainContainer'>
      <div>
          <ProfilePDP/>
      </div>
      <div className='Rpart'>
        {editingUsername ? (
            <div className='username-edit'>
              <input 
                type='text'
                className='inputpseudo'
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button className='editbutton' onClick={handleUsernameChange}>
                <img src={Coche} alt='edit' width='25' height='25'/>
              </button>
              <button className='editbutton' onClick={() => setEditingUsername(false)}>
                <img src={Cancel} alt='edit' width='25' height='25'/>
              </button>
            </div>
          ) : (
            <div className='username-display'>
              <h1>{user?.pseudo}</h1>
              <button className='editbutton' onClick={() => setEditingUsername(true)}>
                <img src={Edit} alt='edit' width='25' height='25'/>
              </button>
            </div>
          )
        }
        <hr/>
        {!editingUsername ? (
        <Button variant="secondary">Modifier le mot de passe</Button>
        ) : (
          <Alert key='info' variant='info' style={{width:'100%'}}>
            Vous êtes en mode "édition".
          </Alert>
        )}
        <div className='bottom'>
          <>
            <Button variant="danger" onClick={handleShowDeleteModal}>Supprimer</Button>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmation de suppression</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                Pour confirmer la suppression de votre compte, veuillez
                  entrer la phrase : "supprimer mon compte".
                </p>
                <Form.Control
                  type='text'
                  placeholder='Entrez la phrase de confirmation'
                  value={confirmationPhrase}
                  onChange={handleConfirmationPhraseChange}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseDeleteModal}>
                  Annuler
                </Button>
                <Button variant='danger' onClick={handleDeleteAccount}>Supprimer mon compte</Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>

      </div>
    </div>
    </>
  );
};

export default Profile;
