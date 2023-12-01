import React, { useEffect, useState } from 'react';
import { useTheme } from '../Style/ThemeContext';
import Player from '../model/Player';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { socket } from '../SocketConfig';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';

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


    //* popup pour salle pleine
    //@ts-ignore
    const renderTooltipFull = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Salle Pleine !
        </Tooltip>
    );
    
    //* popup pour partie déjà lancé
    //@ts-ignore
    const renderTooltipInGame = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            En Jeu !
        </Tooltip>
    );


    //let IsInGame = true;

    let stylefull;
    let colorfull;
    let actualRender;

    if (nbPlayer >= 6) {
        stylefull = "darkred"
        colorfull = "darkred"
        actualRender = renderTooltipFull
    }
    // else if (IsInGame){
    //     stylefull = "darkgreen"
    //     colorfull = "darkgreen"
    // }
    else {
        stylefull = "whitesmoke"
        colorfull = "black"
        actualRender = renderTooltipInGame
    }



    return(
    <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={actualRender}>

        <div className='lobbyMainContainer' onClick={handleContainerClick} style={{borderColor:stylefull}}>
            <header style={{height:'20%', display:'flex', justifyContent:'end'}}>
                <h6><i>Room : {roomNum}</i></h6>
            </header>
            <hr/>
                <h3><b>{HeadPlayer.pseudo}</b></h3>
            <div style={{display:'flex', justifyContent:'end', alignItems:'end'}}>
                <h2 style={{color:colorfull}}>{nbPlayer}/6</h2>
            </div>
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
    </OverlayTrigger>
    );
}

export default LobbyContainer;
