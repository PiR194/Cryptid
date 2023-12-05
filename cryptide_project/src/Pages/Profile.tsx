import React, { useState } from 'react';
import ProfilePDP from '../Components/ProfilePDP';

import SessionService from '../services/SessionService';
import AuthService from '../services/AuthService';


/* Style */
import './Profile.css'
import Edit from "../res/icon/edit-pen.png"
import Coche from '../res/icon/coche.png'
import Cancel from '../res/icon/cancel.png'

/* Nav */
import { useNavigate } from 'react-router-dom';

/* Context */
import { useAuth } from '../Contexts/AuthContext';

/* Boostrap */
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';


const basePath = process.env.REACT_APP_BASE_PATH || '';

//@ts-ignore
const Profile = () => {
  
  const navigate = useNavigate();
  //let player;
  const {user, logout} = useAuth()

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.pseudo);

  //@ts-ignore
  const onUsernameChange = (newUsername) => {
    if(user?.pseudo != null){
      SessionService.UpdatePseudo(user.pseudo, newUsername)
      user.pseudo = newUsername;
    }
  }

  const handleUsernameChange = () => {
    // Maj du pseudo
    onUsernameChange(newUsername);

    // Désactiver le mode d'édition
    setEditingUsername(false);
  };
  

    //* Gestion de la modification du mot de passe :
    // Modal de modification du mot de passe
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showWrongPassword, setShowWrongPassword] = useState(false);
    const [showCorrectPassword, setShowCorrectPassword] = useState(false);
    
    // Etat du mot de passe
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // Etat de l'étape
    const [step, setStep] = useState(1);
    const [DisableNextStep, setDisableNextStep] = useState(true);
    
    // Etat du nouveau mot de passe
    const [confirmNewPassword, setConfirmNewPassword] = useState('');


    const [ percent, setpercent] = useState(0);
    const handleShowPasswordModal = () => {
      setShowPasswordModal(true);
    };
    const handleClosePasswordModal = () => {
      setShowPasswordModal(false);
    };

    //* Vérification de l'ancien mot de passe :
    const handleConfirmedAuth = async () => {
      // Vérification de l'ancien mot de passe
      if(user){
        try {
          if (await AuthService.validatePassword(user?.pseudo, oldPassword)) {
            console.log('Ancien mot de passe correct.');
            setShowWrongPassword(false);
            setShowCorrectPassword(true);
            setDisableNextStep(false);
            setpercent(25);
          }
        } catch (error) {
          console.error(error);
          setShowWrongPassword(true);
          setShowCorrectPassword(false);
          setDisableNextStep(true);
        }
      }
    }

    const handleChangeStep = () => {
      setShowWrongPassword(false);
      setShowCorrectPassword(false);
      setpercent(50);
      setStep(2)
    }

    //* Modification du mot de passe :
    const handlePasswordChange = async () => {
      //Effectuer la modification du mot de passe
      // sinon, affichez une erreur
      if(user){
        if (newPassword === confirmNewPassword) {
          await AuthService.updatePassword(user.pseudo, newPassword);
          console.log('Changement de mot de passe');
          setpercent(100);
          setTimeout(async () => {
            setShowPasswordModal(false);
          }, 1250);
        } else {
          //les mots de passe ne correspondent pas
          console.error("Les mots de passe ne correspondent pas.");
          setShowWrongPassword(true);
          setTimeout(async () => {
            setShowWrongPassword(false);
          }, 1250);
        }
      }
    };
  

    
    //@ts-ignore
    const handleOldPasswordChange = (e) => {
      setOldPassword(e.target.value);
      setpercent(13);
    };
    
    //@ts-ignore
    const handleNewPasswordChange = (e) => {
      setpercent(63);
      setNewPassword(e.target.value);
    };
    //@ts-ignore
    const handleConfirmNewPasswordChange = (e) => {
      setConfirmNewPassword(e.target.value);
      setpercent(75);
    };

  //* Gestion Modal de suppression :
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  //* Confirmation avec la phrase :
  const [confirmationPhrase, setConfirmationPhrase] = useState('');

  const [showWrong, setShowWrong] = useState(false);

  //@ts-ignore
  const handleConfirmationPhraseChange = (e) => {
    setConfirmationPhrase(e.target.value);
  };
  
  const handleDeleteAccount = () => {
    // Verification de la phrase
    if (confirmationPhrase.toLowerCase() === 'supprimer mon compte') {
      console.log('Compte supprimé !');

      if(user!= null){
        const pseudo = user.pseudo;
        logout();
        AuthService.delAccount(pseudo);
      }
      else{
        console.error("l'utilisateur ne peut pas être null")
      }
      handleCloseDeleteModal();

      navigate(`/${basePath}/`)

    } else {
      console.error('Phrase de confirmation incorrecte.');
      setShowWrong(true);
      setTimeout(async () => {
        setShowWrong(false);
      }, 3000);
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
              <h1 className='pseudoDisplay'>{user?.pseudo}</h1>
              <button className='editbutton' onClick={() => setEditingUsername(true)}>
                <img src={Edit} alt='edit' width='25' height='25'/>
              </button>
            </div>  
          )
        }
        <hr/>
        {!editingUsername ? (
        <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Modifier le mot de passe</Button>
        ) : (
          <Alert key='info' variant='info' style={{width:'100%'}}>
            Vous êtes en mode "édition".
          </Alert>
        )}

        {/* Modal de modification de mdp */}
        <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Étape ${step}`}</Modal.Title>
          {/* <ProgressBar animated now={50*step} /> */}
        </Modal.Header>
        <Modal.Body>
          <ProgressBar animated now={percent} />
          {step === 1 && (
            <>
              <p>Entrez votre ancien mot de passe :</p>
              <Form.Control
                type="password"
                placeholder="Ancien mot de passe"
                value={oldPassword}
                onChange={handleOldPasswordChange}
              />
              <Button variant="primary" style={{margin:'15px'}} onClick={handleConfirmedAuth}>
                Confirmer
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <p>Entrez votre nouveau mot de passe :</p>
              <Form.Control
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <br/>

              <p>Confirmez votre nouveau mot de passe :</p>
              <Form.Control
                type="password"
                placeholder="Confirmez le nouveau mot de passe"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
              />
            </>
          )}

          {showWrongPassword && (
            <Alert variant="danger" style={{ width: '100%' }}>
              Ancien mot de passe incorrect.
            </Alert>
          )}
          {showCorrectPassword && (
            <Alert variant="success" style={{ width: '100%' }}>
              Ancien mot de passe correct.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          {step === 1 && (
            <Button variant="secondary" onClick={handleClosePasswordModal}>
              Annuler
            </Button>
          )}

          {step === 2 ? (
            <Button variant="primary" onClick={handlePasswordChange}>
              Modifier le mot de passe
            </Button>
          ) : (
            <Button variant="primary" onClick={handleChangeStep} disabled={DisableNextStep}>
              Étape suivante
            </Button>
          )}
        </Modal.Footer>
      </Modal>


        <div className='bottom'>
          <>
          {!editingUsername && (
            <Button variant="danger" onClick={handleShowDeleteModal}>Supprimer</Button>
          ) }

          {/* Modal de suppression */}
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
                {
                  showWrong && 
                  <Alert key='infomodel' variant='danger' style={{width:'100%'}}>
                    La phrase de confirmation est incorrecte.
                  </Alert>
                }
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
