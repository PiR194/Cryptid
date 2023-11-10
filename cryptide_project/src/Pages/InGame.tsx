import React, { useState } from 'react';

/* Style */
import "./InGame.css"

/* Component */
import GraphContainer from '../Components/GraphContainer';
import ChoiceBar from '../Components/ChoiceBar';
import ButtonImgNav from '../Components/ButtonImgNav';
import PersonStatus from '../Components/PersonStatus';

/* Icon */
import Leave from "../res/icon/leave.png";
import Param from "../res/icon/param.png";
import Replay from "../res/icon/replay.png";
import Info from "../res/icon/infoGreen.png";
import Check from "../res/icon/checkboxGreen.png";
import Alpha from "../res/GreekLetters/alphaW.png";

/* nav */
import { Link } from 'react-router-dom';

/* Boostrap */
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

/* Model */
import Stub from '../source/Stub';

//@ts-ignore
const InGame = ({locale}) => {
    const [showChoiceBar, setShowChoiceBar] = useState(false);
  
    const handleNodeClick = (shouldShowChoiceBar: boolean) => {
      setShowChoiceBar(shouldShowChoiceBar);
    };
  
    /* offcanvas */
    //? faire une fonction pour close et show en fonction de l'etat du canva ?
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showP, setShowP] = useState(false);
    const handleCloseP = () => setShowP(false);
    const handleShowP = () => setShowP(true);
  
    const handleChange = () => {
      if (show){
        handleClose()
      }
      else {
        handleShow()
      }
    };
  
    const handleChangeP = () => {
      if (showP){
        handleCloseP()
      }
      else {
        handleShowP()
      }
    };


    /* Windows open */
    //@ts-ignore
    const openInNewTab = (url) => { //! avec url ==> dangereux
      window.open(url);
    };
  

  const indices = Stub.GenerateIndice()

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
          <button className='button' onClick={handleChangeP}>
            Players
          </button>
        </div>

        <div className='paramDiv'>
          <ButtonImgNav text='paramètres' img={Param} dest='/'/>
        </div>

        <div className='menuGame'>
          <Link to='/info' target='_blank'>
            <button className='button'>
              <img src={Info} alt="info" height="40"/>
            </button>
          </Link>
          {/* <button className='button' onClick={() => openInNewTab('http://localhost:3000/play')}> //! avec url =={'>'} dangereux
            <img src={Check} alt="check" height="40"/>
          </button> */}

          <Link to='/info' target='_blank'>
            <button className='button'>
              <img src={Check} alt="check" height="40"/>
            </button>
          </Link>

          <button className='button' onClick={handleChange}>
            <img src={Alpha} alt="indice" height="40"/>
          </button>
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
            {/* Possède les cheveux noir <u>ou</u> joue au basket */}
            {indices[0].ToString(locale)}<br/>
            {indices[1].ToString(locale)}<br/>
            {indices[2].ToString(locale)}
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
