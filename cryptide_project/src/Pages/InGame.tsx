import React, { useState } from 'react';

/* Style */
import "./InGame.css"

/* Component */
import GraphContainer from '../Components/GraphContainer';
import ChoiceBar from '../Components/ChoiceBar';
import ButtonImgNav from '../Components/ButtonImgNav';

/* Icon */
import Leave from "../res/icon/leave.png";
import Param from "../res/icon/param.png";
import Replay from "../res/icon/replay.png";

/* Boostrap */
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import PersonStatus from '../Components/PersonStatus';

const InGame = () => {
    const [showChoiceBar, setShowChoiceBar] = useState(false);
  
    const handleNodeClick = (shouldShowChoiceBar: boolean) => {
      setShowChoiceBar(shouldShowChoiceBar);
    };
  
    /* offcanvas */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showP, setShowP] = useState(false);
    const handleCloseP = () => setShowP(false);
    const handleShowP = () => setShowP(true);
    return (
      <div id="mainDiv">
        <div className='upperInfo'>
          {/* texte changeable et a traduire */}
          <p>Dummy, à vous de jouer !</p>
        </div>
        <div id='graphDiv'>
          <GraphContainer onNodeClick={handleNodeClick} />
        </div>

        <div className='playerlistDiv'>
          <Button variant="primary" onClick={handleShowP}>
            Players
          </Button>
        </div>

        <div className='paramDiv'>
          <ButtonImgNav text='paramètres' img={Param} dest='/'/>
        </div>

      
        <div className='menuGame'>
          <Button variant="primary" onClick={handleShow}>
            i
          </Button>
          <Button variant="primary" onClick={handleShow}>
            check
          </Button>
          <Button variant="primary" onClick={handleShow}>
            α
          </Button>
        </div>
        <Offcanvas show={showP} 
                  onHide={handleCloseP}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Joueurs</Offcanvas.Title>
            <h3>Il y a 3 joueurs</h3>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* affichage d'une liste responsive dynamic */}
            <PersonStatus state={Replay} name="Dummy"/>
            <PersonStatus state={Replay} name="Boat"/>
            <PersonStatus state={Replay} name="Bot-tom"/>
          </Offcanvas.Body>
        </Offcanvas>

        <Offcanvas show={show} 
                  onHide={handleClose} 
                  placement='end'
                  scroll={true}
                  backdrop={false}
                  style={{ height: '20%', width: '25%', top: '60vh' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Indice</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            Possède les cheveux noir <u>ou</u> joue au basket
          </Offcanvas.Body>
        </Offcanvas>

        <div id="bottom-container">
            {showChoiceBar && <ChoiceBar />}
        </div>
        <div id="endgamebutton"> {/*  tmp */}
          <ButtonImgNav dest="/endgame" img={Leave} text='endgame'/>
        </div>
      </div>
    );
  };
  

export default InGame;
