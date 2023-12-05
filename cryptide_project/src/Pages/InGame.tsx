import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import {saveAs} from "file-saver"

/* Style */
import "./InGame.css"
import {useTheme} from '../Style/ThemeContext'
/* Component */
import GraphContainer from '../Components/GraphContainer';
import ChoiceBar from '../Components/ChoiceBar';
import ButtonImgNav from '../Components/ButtonImgNav';
import PersonStatus from '../Components/PersonStatus';
import PlayerList from '../Components/PlayerList';
import TurnBar from '../Components/TurnBar';

/* Icon */
import Leave from "../res/icon/leave.png";
import Param from "../res/icon/param.png";
import Replay from "../res/icon/replay.png";
import Info from "../res/icon/infoGreen.png";
import Check from "../res/icon/checkboxGreen.png";
import Alpha from "../res/GreekLetters/alphaW.png";
import MGlass from "../res/icon/magnifying-glass.png";
import Download from "../res/icon/download.png"
import Reset from "../res/icon/reset.png";
import Oeye from "../res/icon/eye.png";
import Ceye from "../res/icon/hidden.png";
import JSZip from 'jszip';

/* nav */
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom';

/* Boostrap */
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

/* Model */
import Stub from '../model/Stub';
import { HiLanguage } from 'react-icons/hi2';
import { Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Color from '../model/Color';
import { useGame } from '../Contexts/GameContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { last } from 'lodash';
import { socket } from '../SocketConfig';
import { Network } from 'vis-network';
import {generateLatexCode, generateLatexCodeEnigme} from '../Script/LatexScript';
import Pair from '../model/Pair';
import Indice from '../model/Indices/Indice';

let cptNavigation = 0

const basePath = process.env.REACT_APP_BASE_PATH || '';

//@ts-ignore
const InGame = ({locale, changeLocale}) => {
  
  const theme = useTheme();
  
  const navigate = useNavigate()
  
  const params = new URLSearchParams(window.location.search);

  const navigationType = useNavigationType()
    cptNavigation++
    if (cptNavigation % 2 == 0){
        if (navigationType.toString() == "POP"){
            socket.emit("player quit")
            navigate(`/${basePath}/play`)
        }
    }
  
  //* Gestion solo
  let IsSolo: boolean = true
  const solotmp = params.get('solo');
  if (solotmp == "false"){
    IsSolo=false
  }

  //* Gestion daily
  let isDaily: boolean = true
  const isDailytmp = params.get('daily');
  if (isDailytmp == "false"){
    isDaily=false
  }


  let isEasy: boolean = true
  const isEasytmp = params.get('easy');
  if (isEasytmp == "false"){
    isEasy=false
  }
  //* Historique
  const [history, setHistory] = useState<string[]>([]);
  const [showLast, setShowLast] = useState(false)
  const [askedWrong, setAskedWrong] = useState(false)
  const [importToPdf, setImportToPdf] = useState(false)

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


  const {personNetwork, person, indices} = useGame()

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

  const generateTEX = async () => {
    if (network != null && personNetwork != null && person != null){

      const zip = new JSZip();
      
      if (isDaily && networkEnigme != null){
        const tex = generateLatexCodeEnigme(personNetwork, person, indices, network, networkEnigme)
        const blob = new Blob([tex], { type: 'application/x-latex;charset=utf-8' });
        zip.file('socialGraph.tex', tex);
      }
      else{
        const tex = generateLatexCode(personNetwork, person, indices, network)
        const blob = new Blob([tex], { type: 'application/x-latex;charset=utf-8' });
        zip.file('socialGraph.tex', tex);
      }

      const imageNames = ['ballon-de-basket.png', 'ballon-de-foot.png', "baseball.png", "bowling.png", "tennis.png"]; // Liste des noms de fichiers d'images
      const imagesFolder = 'Script';

      for (const imageName of imageNames) {
        const imageUrl = process.env.PUBLIC_URL + `/${imagesFolder}/${imageName}`;
        const response = await fetch(imageUrl);
        
        if (response.ok) {
          const imageBlob = await response.blob();
          zip.file(`${imageName}`, imageBlob);
        } else {
          console.error(`Erreur de chargement de l'image ${imageName}`);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });

      // Enregistre l'archive en tant que fichier
      saveAs(content, 'social_graph.zip');
      
      // Utiliser FileSaver pour télécharger le fichier
    }
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

    const changeVisibility = () => {
      setLastVisible(!LastVisible);
    }
    const eye = LastVisible ? Oeye : Ceye; //icon que l'on affiche pour l'oeil : fermé ou ouvert.

    /* Windows open */
    //@ts-ignore
    const openInNewTab = (url) => { //! avec url ==> dangereux
      window.open(url);
    };
  
  const [SwitchEnabled, setSwitchEnabled] = useState(false)
  const allIndices = Stub.GenerateIndice()
  const { indice, players } = useGame();


    return (
      <div id="mainDiv">
        {showTurnBar && <TurnBar text={turnBarText}/>}
        <div id='graphDiv'>
          <GraphContainer onNodeClick={handleNodeClick} 
                          handleShowTurnBar={handleShowTurnBar} 
                          handleTurnBarTextChange={handleTurnBarTextChange} 
                          changecptTour={changecptTour} 
                          addToHistory={addToHistory}
                          solo={IsSolo} 
                          isDaily={isDaily} 
                          isEasy={isEasy}
                          setPlayerTouched={handleSetPlayerTouched} 
                          playerTouched={playerTouched}
                          setNetwork={setNetworkData}
                          setNetworkEnigme={setNetworkEnigmeData}
                          showLast={showLast}
                          setPlayerIndex={setPlayerIndexData}
                          askedWrong={askedWrong}
                          setAskedWrong={setAskedWrongData}
                          importToPdf={importToPdf}
                          setImportToPdf={setImportToPdfData}/>
        </div>


        {IsSolo && !isDaily &&
            <div className='nbLaps' style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary
            }}>
              Tour : {cptTour}
            </div>
        }
        
        {(!isDaily || (isDaily && isEasy)) &&
          <div className='historique' id="history-container">
              {history.map((item, index) => (
                  <div key={index}>{item}</div>
              ))}
          </div>
        }   

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
          <Link to='/info' target='_blank'>
            <button className='button' 
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Info} alt="info" height="40"/>
            </button>
          </Link>
          {/* <button className='button' onClick={() => openInNewTab('http://localhost:3000/play')}> //! avec url =={'>'} dangereux
            <img src={Check} alt="check" height="40"/>
          </button> */}

          {!IsSolo &&
          <Link to='/deduc' target='_blank'>
            <button className='button'
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Check} alt="check" height="40"/>
            </button>
          </Link>}

          {!IsSolo && <button className='button' onClick={handleChange}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={MGlass} alt="indice" height="40"/>
          </button>}

          {!IsSolo && <button className='button' onClick={setShowLastData}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={ eye } alt="indice" height="40"/>
          </button>}

          {IsSolo && 
            
            <button className='button' onClick={generateTEX}
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Download} alt="indice" height="40"/>
            </button>
          }

          {IsSolo &&   
            <button className='button' onClick={ () => setImportToPdfData(true)}
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Download} alt="indice" height="40"/>
            </button>
          }
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

          { !IsSolo &&
            <div className='playerlistDiv'>
              <PlayerList players={players} setPlayerTouched={handleSetPlayerTouched} playerTouched={playerTouched} playerIndex={playerIndex} askedWrong={askedWrong}/>
            </div>
          }

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
        {/*
        <div id="endgamebutton" > {/*  tmp 
          <ButtonImgNav dest="/endgame" img={Leave} text='endgame'/>
        </div>
      */}
      </div>
    );
  };
  

export default InGame;
