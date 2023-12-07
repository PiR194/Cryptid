import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import {saveAs} from "file-saver"

/* Style */
import "./InGame.css"
import {useTheme} from '../Style/ThemeContext'
/* Component */
import GraphContainer from '../Components/GraphContainer';
import PlayerList from '../Components/PlayerList';
import TurnBar from '../Components/TurnBar';

/* Icon */
import Param from "../res/icon/param.png";
import Info from "../res/icon/infoGreen.png";
import Check from "../res/icon/checkboxGreen.png";
import MGlass from "../res/icon/magnifying-glass.png";
import Reset from "../res/icon/reset.png";
import Oeye from "../res/icon/eye.png";
import Ceye from "../res/icon/hidden.png";
import ImgBot from "../res/img/bot.png";

import JSZip from 'jszip';

/* nav */
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom';

/* Boostrap */
import Offcanvas from 'react-bootstrap/Offcanvas';

/* Model */
import Stub from '../model/Stub';
import { HiLanguage } from 'react-icons/hi2';
import { Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useGame } from '../Contexts/GameContext';
import { socket } from '../SocketConfig';
import { Network } from 'vis-network';
import {generateLatexCode, generateLatexCodeEnigme} from '../Script/LatexScript';
import Pair from '../model/Pair';
import Indice from '../model/Indices/Indice';
import {basePath} from "../AdressSetup"
import TutorialGraph from '../Components/TutorialGraph';
import { useAuth } from '../Contexts/AuthContext';
import EasyBot from '../model/EasyBot';


let cptNavigation = 0

//@ts-ignore
const Tutorial = ({locale, changeLocale}) => {
  const {personNetwork, person, indices, players, setPlayersData, indice, actualPlayerIndex} = useGame()
  const {user} = useAuth()

  
  const theme = useTheme();
  
  const navigate = useNavigate()
  
  const [greyForEveryone, setGreyForEveryone] = useState<() => void>(() => {});

  const setGreyForEveryoneData = (func: () => void) => {
    setGreyForEveryone(func)
  }

  const navigationType = useNavigationType()
    cptNavigation++
    if (cptNavigation % 2 == 0){
        if (navigationType.toString() == "POP"){
            socket.emit("player quit")
            navigate(`${basePath}/`)
        }
    }
  
  //* Historique
  const [history, setHistory] = useState<string[]>([]);
  const [showLast, setShowLast] = useState(false)
  const [askedWrong, setAskedWrong] = useState(false)
  const [importToPdf, setImportToPdf] = useState(false)
  const [importToJSON, setImportToJSON] = useState(false)
  const [tutoStep, setTutoStep] = useState(0)

  const setTutoStepData = (step: number) => {
    setTutoStep(step)
  }

  const setImportToJSONData = (imp: boolean) => {
    setImportToJSON(imp)
  }

  const setImportToPdfData = (imp: boolean) => {
    setImportToPdf(imp)
  }

  // Fonction pour ajouter un élément à l'historique
  const addToHistory = (message: string) => {
    setHistory(prevHistory => [...prevHistory, message]);
  };
  
  const setShowLastData = () =>{
    setLastVisible(!showLast);
    setShowLast(!showLast);
  }

  const setAskedWrongData = (askedWrong: boolean) => {
    setAskedWrong(askedWrong)
  }

  useEffect(() => {
    const historyContainer = document.getElementById('history-container');
    if (historyContainer) {
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (user == null){
      return
    }
    setPlayersData([user, new EasyBot("Bot1", "Bot1", ImgBot), new EasyBot("Bot2", "Bot2", ImgBot)])
  }, [])



  const [showChoiceBar, setShowChoiceBar] = useState(false);
  const [showTurnBar, setShowTurnBar] = useState(false);
  const [turnBarText, setTurnBarText] = useState("");
  const [playerTouched, setPlayerTouched] = useState(-2)
  const [playerIndex, setPlayerIndex] = useState(-2)


  const [network, setNetwork] = useState<Network | null>(null)
  const [networkEnigme, setNetworkEnigme] = useState<Map<number, Pair<Indice, boolean>[]> | null>(null)

  const setNetworkData = (network: Network) => {
    setNetwork(network)
  }

  const setNetworkEnigmeData = (networkEnigme: Map<number, Pair<Indice, boolean>[]>) => {
    setNetworkEnigme(networkEnigme)
  }

  const handleNodeClick = (shouldShowChoiceBar: boolean) => {
    setShowChoiceBar(shouldShowChoiceBar);
  };

    const handleSetPlayerTouched = (newPlayerTouched: number) => {
      setPlayerTouched(newPlayerTouched);
    };
  

  const handleShowTurnBar = (shouldShowTurnBar: boolean) => {
    setShowTurnBar(shouldShowTurnBar);
  };
  
  const handleTurnBarTextChange = (newTurnBarText: string) =>{
    setTurnBarText(newTurnBarText)
  }

  const setPlayerIndexData = (playerIndex: number) => {
    setPlayerIndex(playerIndex)
  }

  
  const resetGraph = () => {
    setisLoading(true);
    socket.emit("reset graph", socket.id)
    setTimeout(() => {
      setisLoading(false);
    }, 2000);  
  }

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

  const [cptTour, setcptTour] = useState(0);

  const [LastVisible, setLastVisible] = useState(false);

  const [isLoading, setisLoading] = useState(false);
  

  //@ts-ignore
  const changecptTour = (newcptTour) => {
    setcptTour(newcptTour);
  };
  
    const handleChange = () => {
      if (show){
        handleClose()
      }
      else {
        handleShow()
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

    const eye = LastVisible ? Oeye : Ceye; //icon que l'on affiche pour l'oeil : fermé ou ouvert.

    /* Windows open */
    //@ts-ignore
    const openInNewTab = (url) => { //! avec url ==> dangereux
      window.open(url);
    };
  
  const [SwitchEnabled, setSwitchEnabled] = useState(false)
  const allIndices = Stub.GenerateIndice()

  const nbPlayer = players.length;
  const navdeduc = 'deduc?actualId=' + actualPlayerIndex + '&nbPlayer=' + nbPlayer;

    return (
      <div id="mainDiv">
        {showTurnBar && <TurnBar text={turnBarText}/>}
        <div id='graphDiv'>
          <TutorialGraph  tutoStep={tutoStep}
                          setTutoStep={setTutoStepData}
                          handleShowTurnBar={handleShowTurnBar} 
                          handleTurnBarTextChange={handleTurnBarTextChange} 
                          addToHistory={addToHistory}
                          setPlayerTouched={handleSetPlayerTouched} 
                          playerTouched={playerTouched}
                          setNetwork={setNetworkData}
                          showLast={showLast}
                          setPlayerIndex={setPlayerIndexData}
                          setGreyForEveryone={setGreyForEveryoneData}/>
        </div>

        <div className='historique' id="history-container">
            {history.map((item, index) => (
                <div key={index}>{item}</div>
            ))}
        </div>
         

        <div className='paramDiv'>
          <button className='button'
            style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
            }}
            onClick={handleChangeS}>
            <img src={Param} alt="paramètres" height='40'/>
          </button>
        </div>



        <div className='menuGame'>
          <div className='resetDiv'>
            <button className='button'
              style={{ 
                  backgroundColor: theme.colors.tertiary,
                  borderColor: theme.colors.secondary
              }}
              onClick={resetGraph}>
              
              {
                isLoading ? (
                  <Spinner animation="grow" />
                  )
                  : (
                  <img src={Reset} alt="paramètres" height='40'/>
                )
              }
              
              
            </button>
          </div>




          {/* <Link to='/info#indice-possible' target='_blank'> 
            //? redirection impossible apparament (securité des navigateur
          */}
          <Link to={`${basePath}/info`} target='_blank'>
            <button className='button' 
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Info} alt="info" height="40"/>
            </button>
          </Link>

          <Link to={`${basePath}/${navdeduc}`} target='_blank'>
            <button className='button'
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Check} alt="check" height="40"/>
            </button>
          </Link>

          <button className='button' onClick={handleChange}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={MGlass} alt="indice" height="40"/>
          </button>

          <button className='button' onClick={setShowLastData}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={ eye } alt="indice" height="40"/>
          </button>
        </div>

{/*
        <Offcanvas show={showP} 
                  onHide={handleCloseP}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Joueurs</Offcanvas.Title>
            <h3>Il y a {players.length} joueurs</h3>
          </Offcanvas.Header>
          <Offcanvas.Body>

          </Offcanvas.Body>
        </Offcanvas>
          */}

          
          <div className='playerlistDiv'>
            <PlayerList players={players} setPlayerTouched={handleSetPlayerTouched} playerTouched={playerTouched} playerIndex={playerIndex} askedWrong={askedWrong} greyForEveryone={greyForEveryone}/>
          </div>
          

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
            {indice?.ToString(locale)}
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
      </div>
    );
  };
  

export default Tutorial;
