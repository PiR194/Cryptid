import React, { useEffect, useState } from 'react';
import { useTheme } from '../Style/ThemeContext';
import Player from '../model/Player';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { socket } from '../SocketConfig';

interface LobbyContainerProps {
        roomNum : string
        HeadPlayer : Player
        nbPlayer : number
        setFirst: (first: boolean) => void
    //? mettre un "nbplayermax" si le nombre de joueur max peut etre fixé ?
}

const LobbyContainer: React.FC<LobbyContainerProps> = ({roomNum, HeadPlayer, nbPlayer, setFirst}) => {
    const theme=useTheme();

    const navigate = useNavigate();
    const dest = '/lobby?room=' + roomNum;

    //* Modal
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleContainerClick = () => {
        
        if (show){
            handleClose()
        }
        else{
            if (nbPlayer < 6) {
                socket.off("request lobbies")
                setFirst(true)
                navigate(dest);
            } else {
                handleShow()
                //alert('La salle est pleine. Impossible de rejoindre.');
            }
        }
    };

    let stylefull;
    let colorfull;
    if (nbPlayer >= 6) {
        stylefull = "darkred"
        colorfull = "darkred"
    }
    else {
        stylefull = "whitesmoke"
        colorfull = "black"
    }

    return(
        <div className='lobbyMainContainer' onClick={handleContainerClick} style={{borderColor:stylefull}}>
                <header style={{height:'20%', display:'flex', justifyContent:'end'}}>
                    <h6><i>Room : {roomNum}</i></h6>
                </header>
                <hr/>
                    <h3><b>{HeadPlayer.pseudo}</b></h3>
                <div style={{display:'flex', justifyContent:'end', alignItems:'end'}}>
                    <h2 style={{color:colorfull}}>{nbPlayer}/6</h2>
                </div>
{/* 
                <Button onClick={handleContainerClick} variant='danger'>
                    click
                </Button> */}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Salle pleine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>La salle est pleine, il est impossible d'y aller pour le moment !</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Ok
                    </Button>
                    </Modal.Footer>
                </Modal>

        </div>
    );
}

export default LobbyContainer;
