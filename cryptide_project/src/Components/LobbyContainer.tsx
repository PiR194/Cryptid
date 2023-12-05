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
        started : boolean
    //? mettre un "nbplayermax" si le nombre de joueur max peut etre fixé ?
}

const basePath = process.env.REACT_APP_BASE_PATH || '';

const LobbyContainer: React.FC<LobbyContainerProps> = ({roomNum, HeadPlayer, nbPlayer, setFirst, started}) => {
    const theme=useTheme();

    const navigate = useNavigate();
    const dest = '/lobby?room=' + roomNum;

    //* Modal
    const [showFull, setShowFull] = useState(false);
    const [showStart, setShowStart] = useState(false);

    const handleClose = () => {
        setShowFull(false) 
        setShowStart(false)
    };
    
    const handleShowFull = () => setShowFull(true);
    const handleShowStart = () => setShowStart(true);

    const handleContainerClick = () => {
        
        if (showFull || showStart){
            handleClose()
        }
        else{
            if (nbPlayer < 6 && !started) {
                socket.off("request lobbies")
                setFirst(true)
                navigate(`/${basePath}/${dest}`);
            }
            else if(started){
                handleShowStart()
            }
            else {
                handleShowFull()
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

    //* autre
    //@ts-ignore
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Rejoindre le lobby !
        </Tooltip>
    );

    //let IsInGame = true;

    let stylefull;
    let colorfull;
    let actualRender = renderTooltip;
    let bgcol = 'white';

    if (nbPlayer >= 6) {
        stylefull = "darkred"
        colorfull = "darkred"
        actualRender = renderTooltipFull

    }
    else {
        stylefull = "whitesmoke"
        colorfull = "black"
    }
    
    if(started){
        bgcol = 'lightgrey' //! le hover ne marche plus
        actualRender = renderTooltipInGame
    }



    return(
    <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={actualRender}>

        <div className='lobbyMainContainer' onClick={handleContainerClick} style={{borderColor:stylefull, backgroundColor:bgcol}}>
            <header style={{height:'20%', display:'flex', justifyContent:'end'}}>
                <h6><i>Room : {roomNum}</i></h6>
            </header>
            <hr/>
                <h3><b>{HeadPlayer.pseudo}</b></h3>
            <div style={{display:'flex', justifyContent:'end', alignItems:'end'}}>
                <h2 style={{color:colorfull}}>{nbPlayer}/6</h2>
            </div>

            {/* Modals */}
            <Modal show={showFull} onHide={handleClose}>
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

            <Modal show={showStart} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>La partie a déjà commencée</Modal.Title> 
                </Modal.Header>
                <Modal.Body>La partie a déjà commencée, il est impossible d'y aller pour le moment !</Modal.Body>
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
