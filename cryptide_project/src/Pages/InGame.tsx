import React, { useState } from 'react';
import Switch from "react-switch";

/* Style */
import "./InGame.css"
import {useTheme} from '../Style/ThemeContext'
/* Component */
import GraphContainer from '../Components/GraphContainer';
import ChoiceBar from '../Components/ChoiceBar';
import ButtonImgNav from '../Components/ButtonImgNav';
import PersonStatus from '../Components/PersonStatus';
import PlayerList from '../Components/PlayerList';

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
import { HiLanguage } from 'react-icons/hi2';
import { Nav, NavDropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

//@ts-ignore
const InGame = ({locale, changeLocale}) => {
    const [showChoiceBar, setShowChoiceBar] = useState(false);
  
    const theme = useTheme();
    const handleNodeClick = (shouldShowChoiceBar: boolean) => {
      setShowChoiceBar(shouldShowChoiceBar);
    };
  
    /* offcanvas */
    //? faire une fonction pour close et show en fonction de l'etat du canva ?
    //? comment faire pour eviter la recopie de tout le code a chaque canvas boostrap ?
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showP, setShowP] = useState(false);
    const handleCloseP = () => setShowP(false);
    const handleShowP = () => setShowP(true);
  
    const [showS, setShowS] = useState(false);
    const handleCloseS = () => setShowS(false);
    const handleShowS = () => setShowS(true);
  
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

    const handleChangeS = () => {
      if (showS){
        handleCloseS()
      }
      else {
        handleShowS()
      }
    };

    /* Windows open */
    //@ts-ignore
    const openInNewTab = (url) => { //! avec url ==> dangereux
      window.open(url);
    };
  
  const [SwitchEnabled, setSwitchEnabled] = useState(false)
  const indices = Stub.GenerateIndice()

    return (
      <div id="mainDiv">
        <div className='upperInfo' 
          style={{ 
              borderColor: theme.colors.secondary
          }}>
          {/* texte changeable et a traduire */}
          <p>Dummy, à vous de jouer !</p>
        </div>
        <div id='graphDiv'>
          <GraphContainer onNodeClick={handleNodeClick} />
        </div>

        <div className='playerlistDiv'>
          <button className='button' 
            style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary
            }}
            onClick={handleChangeP}>
            Players
          </button>
        </div>

        <div className='paramDiv'>
          <button className='button'
            style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary
            }}
            onClick={handleChangeS}>
            <img src={Param} alt="paramètres" height='40'/>
          </button>
        </div>

        <div className='menuGame'>
          <Link to='/info' target='_blank'>
            <button className='button' 
              style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Info} alt="info" height="40"/>
            </button>
          </Link>
          {/* <button className='button' onClick={() => openInNewTab('http://localhost:3000/play')}> //! avec url =={'>'} dangereux
            <img src={Check} alt="check" height="40"/>
          </button> */}

          <Link to='/info' target='_blank'>
            <button className='button'
              style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Check} alt="check" height="40"/>
            </button>
          </Link>

          <button className='button' onClick={handleChange}
            style={{ 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.secondary
            }}>
            <img src={Alpha} alt="indice" height="40"/>
          </button>
        </div>

        <Offcanvas show={showP} 
                  onHide={handleCloseP}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Joueurs</Offcanvas.Title>
            <h3>Il y a {players.length} joueurs</h3>
          </Offcanvas.Header>
          <Offcanvas.Body>
              {/* affichage d'une liste responsive dynamic */}
            {/* <div className='playerCanvasBody'>
              <PersonStatus state={Replay} name="Dummy"/>
              <PersonStatus state={Replay} name="Boat"/>
              <PersonStatus state={Replay} name="Bot-tom"/>
            </div> */}
            <PlayerList players={players} />
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

        {
          //* canva pour les paramètres
        }
        <Offcanvas show={showS} 
                  onHide={handleCloseS} 
                  placement='top'
                  style={{height: '30%', width: '30%', left: '70%' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title><img src={Param} alt='param'/> Paramètres</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto">
                <NavDropdown 
                title={<span><HiLanguage/> Language </span>}
                className="navbar-title" id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={() => changeLocale('fr')}> 
                        <FormattedMessage id="languageSelector.french"/> 
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => changeLocale('en')}> 
                        <FormattedMessage id="languageSelector.english"/> 
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>

            <label>
              <Switch checked={SwitchEnabled} onChange={setSwitchEnabled}/>
              <p>Afficher les noeuds possibles</p>
            </label>

          </Offcanvas.Body>
        </Offcanvas>

        <div id="bottom-container">
          {showChoiceBar && <ChoiceBar />}
        </div>
        <div id="endgamebutton" > {/*  tmp */}
          <ButtonImgNav dest="/endgame" img={Leave} text='endgame'/>
        </div>
      </div>
    );
  };
  

export default InGame;
