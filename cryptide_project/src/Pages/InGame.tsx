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
import Param from "../res/icon/param.png";
import Info from "../res/icon/infoGreen.png";
import Check from "../res/icon/checkboxGreen.png";
import MGlass from "../res/icon/magnifying-glass.png";
import Pdf from "../res/icon/pdf.png"
import Tex from "../res/icon/tex.png"
import Reset from "../res/icon/reset.png";
import Oeye from "../res/icon/eye.png";
import Ceye from "../res/icon/hidden.png";
import JSZip from 'jszip';

/* Sound */
import turnSound from "../res/Audio/turn.mp3";
import winSound from "../res/Audio/win.wav";


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
import {basePath} from "../AdressSetup"
import { useAuth } from '../Contexts/AuthContext';


let cptNavigation = 0

//@ts-ignore
const InGame = ({locale, changeLocale}) => {
  
  const theme = useTheme();
  
  const navigate = useNavigate()
  const {user, manager} = useAuth()
  
  const params = new URLSearchParams(window.location.search);

  const navigationType = useNavigationType()
    cptNavigation++
    if (cptNavigation % 2 == 0){
        if (navigationType.toString() == "POP"){
            socket.emit("player quit")
            navigate(``)
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


  let difficulty: string = "";
  let difficultyTmp = params.get('difficulty')
  if (difficultyTmp !== null){
    difficulty=difficultyTmp
  }

  //* Historique
  const [history, setHistory] = useState<string[]>([]);
  const [showLast, setShowLast] = useState(false)
  const [askedWrong, setAskedWrong] = useState(false)
  const [importToPdf, setImportToPdf] = useState(false)
  const [importToJSON, setImportToJSON] = useState(false)
  const [firstHistory, setFirstHistory] = useState(true)

  const [putCorrectBackground, setPutCorrectBackground] = useState<() => void>(() => {});
  const [putGreyBackgroud, setPutGreyBackground] = useState<() => void>(() => {});
  const [putImposssibleGrey, setPutImposssibleGrey] = useState<() => void>(() => {});
  const [changeGraph, setChangeGraph] = useState<(nbNodes: number, nbIndices: number) => void>(() => {});



  const setPutCorrectBackgroundData = (func: () => void) => {
    setPutCorrectBackground(func)
  }

  const setPutGreyBackgroundData = (func: () => void) => {
    setPutGreyBackground(func)
  }

  const setPutImposssibleGreyData = (func: () => void) => {
    setPutImposssibleGrey(func)
  }

  const setChangeGraphData = (func: (nbNodes: number, nbIndices: number) => void) => {
    setChangeGraph(func)
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

  const [cptTour, setcptTour] = useState(1);

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
  
  // const [SwitchEnabled, setSwitchEnabled] = useState(false)
  const allIndices = Stub.GenerateIndice()
  const { indice, players, actualPlayerIndex} = useGame();

  const nbPlayer = players.length;
  const navdeduc = 'deduc?actualId=' + actualPlayerIndex + '&nbPlayer=' + nbPlayer;


  //* Sound
  const [playTurnSound, setPlayTurnSound] = useState(false);
  const [soundPreference, setSoundPreference] = useState(true); // utilisateur

  const [enteredNumber, setEnteredNumber] = useState(user?.nbNodes || 25);
  const [enteredNumberIndices, setEnteredNumberIndices] = useState(user?.nbIndices || 3);


  //@ts-ignore
  const handleNumberChange = (event) => {
    if (parseInt(event.target.value)){
      setEnteredNumber(parseInt(event.target.value));
    }
  };

  //@ts-ignore
  const handleKeyDown = (event) => {
    // Vérifier si la touche appuyée est "Entrée"
    if (event.key === 'Enter' && user!==null && parseInt(event.target.value)) {
      const newNumber = Math.max(20, Math.min(50, parseInt(event.target.value, 10)));
      user.nbNodes = newNumber;
      setEnteredNumber(newNumber);
    }
  };
  
  const handleBlur = () => {
    if (user!==null){
      const newNumber = Math.max(20, Math.min(50, enteredNumber));
      user.nbNodes = newNumber;
      setEnteredNumber(newNumber);
    }
  };
  

  //@ts-ignore
  const handleNumberIndicesChange = (event) => {
    if (parseInt(event.target.value)){
      setEnteredNumberIndices(parseInt(event.target.value));
    }
};

useEffect(() => {
  if (changeGraph){
    if (enteredNumber>=20 && enteredNumber<=50 && enteredNumberIndices>=3 && enteredNumberIndices<=6){
      console.log(enteredNumber)
      console.log(enteredNumberIndices)
      manager?.userService.changeNodesIndices(enteredNumber, enteredNumberIndices)
      setHistory([]);
      setFirstHistory(true)
      changeGraph(enteredNumber, enteredNumberIndices)
    }
  }
  else{
    setEnteredNumber(user?.nbNodes || 25)
    setEnteredNumberIndices(user?.nbIndices || 3)
  }
}, [enteredNumber, enteredNumberIndices])

//@ts-ignore
const handleKeyDownIndice = (event) => {
  // Vérifier si la touche appuyée est "Entrée"
  if (event.key === 'Enter' && user!=null && parseInt(event.target.value)) {
    const newNumber = Math.max(3, Math.min(6, parseInt(event.target.value, 10)));
    user.nbIndices = newNumber;
    setEnteredNumberIndices(newNumber);
  }
};

const handleBlurIndice = () => {
  if (user!==null){
    const newNumber = Math.max(3, Math.min(6, enteredNumberIndices));
    setEnteredNumberIndices(newNumber);
    user.nbIndices = newNumber;
  }
};

  const handleSoundPreferenceChange = () => {
    setSoundPreference(!soundPreference);
    console.log("changement des options du son : "+ soundPreference)
  };

  const handleTurn = () => {
    
    console.log("etat normal du sound : " + soundPreference)
    if (soundPreference) {
      setPlayTurnSound(true);
      
      setTimeout(() => {
        setPlayTurnSound(false);
      }, 2000);
    }
  };


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
                          difficulty={difficulty}
                          setPlayerTouched={handleSetPlayerTouched} 
                          playerTouched={playerTouched}
                          setNetwork={setNetworkData}
                          setNetworkEnigme={setNetworkEnigmeData}
                          showLast={showLast}
                          setPlayerIndex={setPlayerIndexData}
                          askedWrong={askedWrong}
                          setAskedWrong={setAskedWrongData}
                          importToPdf={importToPdf}
                          setImportToPdf={setImportToPdfData}
                          importToJSON={importToJSON}
                          setImportToJSON={setImportToJSONData}
                          setPutCorrectBackground={setPutCorrectBackgroundData}
                          setPutGreyBackground={setPutGreyBackgroundData}
                          setPutImposssibleGrey={setPutImposssibleGreyData}
                          putCorrectBackground={putCorrectBackground}
                          putGreyBackground={putGreyBackgroud}
                          putImposssibleGrey={putImposssibleGrey}
                          handleTurn={handleTurn}
                          lang={locale}
                          setChangeGraph={setChangeGraphData}/>
        </div>
        {playTurnSound && <audio src={turnSound} autoPlay />}


        {IsSolo && (!isDaily || difficulty !== "hard") &&
            <div className='nbLaps' style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary
            }}>
              <FormattedMessage id='turn'/> : {cptTour}
            </div>
        }
        
        {(!isDaily || (isDaily && (difficulty==="easy" || difficulty==="intermediate"))) &&
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
          <Link to={`info`} target='_blank'>
            <button className='button' 
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Info} alt="info" height="40"/>
            </button>
          </Link>

          {!IsSolo &&
          <Link to={`${navdeduc}`} target='_blank'>
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
              <img src={Tex} alt="indice" height="40"/>
            </button>
          }

          {IsSolo &&   
            <button className='button' onClick={ () => setImportToPdfData(true)}
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Pdf} alt="indice" height="40"/>
            </button>
          }
        </div>

          { !IsSolo &&
            <div className='playerlistDiv'>
              <PlayerList players={players} setPlayerTouched={handleSetPlayerTouched} playerTouched={playerTouched} playerIndex={playerIndex} askedWrong={askedWrong} greyForEveryone={() => {}}/>
            </div>
          }

        <Offcanvas show={show} 
                  onHide={handleClose} 
                  placement='end'
                  scroll={true}
                  backdrop={false}
                  style={{ height: '20%', width: '25%', top: '60vh' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title><FormattedMessage id='indice'/></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {indice?.ToString(locale)}
          </Offcanvas.Body>
        </Offcanvas>

        {
          //* canva pour les paramètres
        }
        <Offcanvas show={showS} 
                  onHide={handleCloseS} 
                  placement='top'
                  style={{height: '80%', width: '30%', left: '70%' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title><img src={Param} alt='param'/> <FormattedMessage id='param'/></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body >
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
              <label style={{ display:'flex'}}>
                <Switch checked={soundPreference} onChange={handleSoundPreferenceChange}/>
                <p style={{ marginLeft:'20px'}}><FormattedMessage id='sfx'/></p>
              </label>

              {IsSolo && 
              <div className='nbNodeDiv' style={{ padding:'20px'}}>
                  <label htmlFor="numberInput"><FormattedMessage id='param.node'/> :</label>
                  <div>
                      <button className='valuebutton' onClick={() => { if (enteredNumber>20 && user !== null){ setEnteredNumber(enteredNumber-1); user.nbNodes = user.nbNodes-1; setHistory([]); }}}
                          style={{borderColor:theme.colors.secondary}}> - </button>
                      <input
                          // type="number"
                          style={{textAlign:'center', border: 'none', width: '100px'}}
                          id="numberInput"
                          value={enteredNumber}
                          onChange={handleNumberChange}
                          onKeyDown={handleKeyDown} // Ajout de l'événement onKeyDown
                          onBlur={handleBlur} // Ajout de l'événement onBlur
                          />
                      <button className='valuebutton' onClick={() => { if (enteredNumber<50 && user!==null){ setEnteredNumber(enteredNumber+1); user.nbNodes = user.nbNodes+1 ;setHistory([]); }}}
                          style={{borderColor:theme.colors.secondary}}> + </button>
                  </div>
              </div>}

              {IsSolo && 
              <div className='nbNodeDiv' style={{ padding:'20px'}}>
                  <label htmlFor="numberInput"><FormattedMessage id='param.clue'/> :</label>
                  <div>
                      <button className='valuebutton' onClick={() => { if (enteredNumberIndices>3 && user!==null){ setEnteredNumberIndices(enteredNumberIndices - 1); user.nbIndices = user.nbIndices-1; setHistory([]); }}}
                          style={{borderColor:theme.colors.secondary}}> - </button>
                      <input
                          // type="number"
                          style={{textAlign:'center', border: 'none', width: '100px'}}
                          id="numberInput"
                          value={enteredNumberIndices}
                          onChange={handleNumberIndicesChange}
                          onKeyDown={handleKeyDownIndice} // Ajout de l'événement onKeyDown
                          onBlur={handleBlurIndice}/>
                      <button className='valuebutton' onClick={() => { if (enteredNumberIndices<6 && user!==null){ setEnteredNumberIndices(enteredNumberIndices + 1); user.nbIndices = user.nbIndices+1; setHistory([]); }}}
                          style={{borderColor:theme.colors.secondary}}> + </button>
                  </div>
              </div>}
              <div className='centerDivH' style={{margin: "20px"}}>
                <Button variant="outline-warning" onClick={() => {setHistory([]); changeGraph(enteredNumber, enteredNumberIndices)}}><FormattedMessage id='regenerate'/></Button>
              </div>
                <Button variant="outline-danger" href={``}><FormattedMessage id='BackHome'/></Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
  };
  

export default InGame;
