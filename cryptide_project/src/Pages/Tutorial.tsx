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
import ava from "../res/img/tuto/tuto-ava.png";

/* nav */
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom';

/* Boostrap */
import Offcanvas from 'react-bootstrap/Offcanvas';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

/* Model */
import Stub from '../model/Stub';
import { useGame } from '../Contexts/GameContext';
import { socket } from '../SocketConfig';
import { Network } from 'vis-network';
import {generateLatexCode, generateLatexCodeEnigme} from '../Script/LatexScript';
import Pair from '../model/Pair';
import Indice from '../model/Indices/Indice';
import {basePath} from "../AdressSetup"
import TutorialGraph from '../Components/TutorialGraph';
import JSZip from 'jszip';


let cptNavigation = 0

//@ts-ignore
const Tutorial = ({locale, changeLocale}) => {
  
  const theme = useTheme();
  
  const navigate = useNavigate()
  
  const params = new URLSearchParams(window.location.search);

  const navigationType = useNavigationType()
    cptNavigation++
    if (cptNavigation % 2 == 0){
        if (navigationType.toString() == "POP"){
            socket.emit("player quit")
            navigate(`${basePath}/`)
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
  const [importToJSON, setImportToJSON] = useState(false)

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
  const { indice, players, actualPlayerIndex} = useGame();

  const nbPlayer = players.length;
  const navdeduc = 'deduc?actualId=' + actualPlayerIndex + '&nbPlayer=' + nbPlayer;



    //* gestion demo */
  const [showM, setShowM] = useState(false);

  const handleCloseM = () => setShowM(false);
  const handleShowM = () => setShowM(true);

  const [step, setStep] = useState(0);
    return (
      <div id="mainDiv">
        {showTurnBar && <TurnBar text={turnBarText}/>}
        <div id='graphDiv'>
          <TutorialGraph onNodeClick={handleNodeClick} 
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
                          setImportToPdf={setImportToPdfData}
                          importToJSON={importToJSON}
                          setImportToJSON={setImportToJSONData}/>
        </div>

        
        {(!isDaily || (isDaily && isEasy)) &&
          <div className='historique' id="history-container">
              {history.map((item, index) => (
                  <div key={index}>{item}</div>
              ))}
          </div>
        }   

        <div className='menuGame'>
          <Button variant="primary" onClick={handleShowM}>
              Aide
          </Button>
          <Link to={`${basePath}/info`} target='_blank'>
            <button className='button' 
              style={{ 
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.secondary
              }}>
              <img src={Info} alt="info" height="40"/>
            </button>
          </Link>

          <button className='button' onClick={handleChange}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={MGlass} alt="indice" height="40"/>
          </button>

          {!IsSolo && <button className='button' onClick={setShowLastData}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={ eye } alt="indice" height="40"/>
          </button>}
        </div>

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
            {indice?.ToString(locale)}
          </Offcanvas.Body>
        </Offcanvas>
      




        <Modal
          show={showM}
          onHide={handleCloseM}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tutoriel 1</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

            {step === 0 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={ava} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Les Personnes</Card.Title>
                  <Card.Text>
                    Les sommets du graphes représentent les personnes, chaque personne possède différentes caractéristiques, que ce soit leur nom, âge, sport et leur couleur de cheveux.
                    <br />
                    Par exemple, ici, Nous avons <b>Ava</b>, qui a <b>40 ans</b>, qui pratique du <b>Basket</b> et du <b>Tennis</b>, qui a les cheveux <b>Roux</b> et qui possède <b>2 voisins</b>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 1 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={ava} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Les Joueurs</Card.Title>
                  <Card.Text>
                    Les sommets du graphes représentent les personnes, chaque personne possède différentes caractéristiques, que ce soit leur nom, âge, sport et leur couleur de cheveux.
                    <br />
                    Par exemple, ici, Nous avons <b>Ava</b>, qui a <b>40 ans</b>, qui pratique du <b>Basket</b> et du <b>Tennis</b>, qui a les cheveux <b>Roux</b> et qui possède <b>2 voisins</b>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 2 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={ava} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>L'historique</Card.Title>
                  <Card.Text>
                    Les sommets du graphes représentent les personnes, chaque personne possède différentes caractéristiques, que ce soit leur nom, âge, sport et leur couleur de cheveux.
                    <br />
                    Par exemple, ici, Nous avons <b>Ava</b>, qui a <b>40 ans</b>, qui pratique du <b>Basket</b> et du <b>Tennis</b>, qui a les cheveux <b>Roux</b> et qui possède <b>2 voisins</b>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 3 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={Info} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Les règle du jeu</Card.Title>
                  <Card.Text>
                    Ce bouton vous mène a la page d'information du jeu, avec toutes les règles du jeu, que ce soit les objectifs, les indices, le déroulement, etc...
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 4 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={MGlass} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>L'indice</Card.Title>
                  <Card.Text>
                    Ce boutons vous permet d'afficher votre indice personnel, gradez le secret ! Il s'agit de votre meilleur atout pour gagner.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleCloseM}>
              Fermer
            </Button> */}
            { step != 0 && (<Button variant="primary" onClick={() => setStep(step - 1)}>Précédent</Button>)}
            <Button variant="primary" onClick={() => setStep(step + 1)}>Suivant</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  };
  

export default Tutorial;
