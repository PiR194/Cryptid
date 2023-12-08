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

import ava from "../res/img/tuto/tuto-ava.png";
import indicetxt from "../res/img/tuto/tuto-indiceTxt.png"
import rep from "../res/img/tuto/tuto-rep.png";
import joueurs from "../res/img/tuto/tuto-joueurs.png";
import graph from "../res/img/tuto/tuto-graph.png";

import step1 from "../res/img/tuto/tuto2-1.png";
import step2 from "../res/img/tuto/tuto2-2.png";
import step3 from "../res/img/tuto/tuto2-3.png";
import step4 from "../res/img/tuto/tuto2-4.png";
import step5 from "../res/img/tuto/tuto2-5.png";
import step6 from "../res/img/tuto/tuto2-6.png";

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
import { useAuth } from '../Contexts/AuthContext';
import EasyBot from '../model/EasyBot';
import { set } from 'lodash';


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



    //* gestion demo */
  const [showM, setShowM] = useState(false);
  const [showTuto2, setShowTuto2] = useState(false);
  const [showTuto21, setShowTuto21] = useState(false);
  const [showTuto22, setShowTuto22] = useState(false);
  const [showTuto3, setShowTuto3] = useState(false);

  const handleCloseM = () => {
    setShowM(false);
    handleShowHelp()
  }
  const handleShowM = () => setShowM(true);

  const handleCloseHelp = () => {
    switch(tutoStep){
      case 0:
        setShowTuto2(false);
        break;
      case 1:
        setShowTuto21(false);
        break;
      case 2:
        setShowTuto22(false);
        break;
      case 3:
        setShowTuto3(false);
        break;
    }
  }
  const handleShowHelp = () => {
    switch(tutoStep){
      case 0:
        setShowTuto2(true);
        break;
      case 1:
        setShowTuto21(true);
        break;
      case 2:
        setShowTuto22(true);
        break;
      case 3:
        setShowTuto3(true);
        break;
    }
  }
  

  const handleCloseTuto2 = () => setShowTuto2(false);
  const handleShowTuto2 = () => setShowTuto2(true);

  const handleCloseTuto21 = () => setShowTuto21(false);
  const handleShowTuto21 = () => setShowTuto21(true);

  const handleCloseTuto22 = () => setShowTuto22(false);
  const handleShowTuto22 = () => setShowTuto22(true);
  
  const handleCloseTuto3 = () => setShowTuto3(false);
  const handleShowTuto3 = () => setShowTuto3(true);
  

  const [step, setStep] = useState(-1);

  //@ts-ignore
  const displayModalstep = (step: number) => {
    //* for step 2
    setStep(0); // remise a 0 de step
    switch(step) {
      case 1:
        setShowTuto21(true);
        break;
      case 2:
        setShowTuto22(true);
        break;
      case 3:
        setShowTuto3(true);
        break;
    }
  
  }

  useEffect(() => {
    handleShowM();
  }, [])

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
                          setGreyForEveryone={setGreyForEveryoneData}
                          displayModalstep={displayModalstep}/>
        </div>

        <div className='historique' id="history-container">
            {history.map((item, index) => (
                <div key={index}>{item}</div>
            ))}
        </div>


        <div className='menuGame'>
          {/* <Button variant="primary" onClick={handleShowM}>
              tuto 1
          </Button>
          <Button variant="primary" onClick={handleShowTuto2} disabled={tuto1disable}>
              tuto 2
          </Button> */}

          <Button variant="primary" onClick={handleShowHelp}>
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

          <button className='button' onClick={setShowLastData}
            style={{ 
              backgroundColor: theme.colors.tertiary,
              borderColor: theme.colors.secondary
            }}>
            <img src={ eye } alt="indice" height="40"/>
          </button>
        </div>

          
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
            {indice?.ToString(locale)}
          </Offcanvas.Body>
        </Offcanvas>
      


        <Modal
          show={showM}
          onHide={handleCloseM}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ maxHeight: '100vh'}}>
          <Modal.Header>
            <Modal.Title>Tutoriel</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

          {step === -1 && (
            <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
              <Card.Img variant="top" src={ava} style={{width:'300px', height:'300px'}}/>
              <Card.Body>
                <Card.Title> Bienvenue dans SocialGraph</Card.Title>
                <Card.Text>
                Vous incarnez un détective assoiffé de gloire, confronté à un crime. <br/>
                Cependant, d'autres enquêteurs sont également sur le coup, tous cherchant à décrocher le titre de meilleur détective du monde. <br/>
                Chacun possède un indice crucial pour identifier le coupable, il va falloir déduire l'indice de vos concurrents si vous souhaitez l'emporter ! <br/>
                Interrogez vos concurrents pour obtenir des réponses par oui ou non, mais méfiez-vous, un refus a des conséquences. <br/>
                Soyez le premier à déduire les indices des autres et à trouver le coupable pour remporter la reconnaissance tant convoitée. <br />
                <i>Si vous avez le moindre doute, cliquer sur le bouton "aide" pour afficher l'étape actuel du tuto</i>
                </Card.Text>
              </Card.Body>
            </Card>
          )}
            {step === 0 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={ava} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Les Suspects</Card.Title>
                  <Card.Text>
                    Voici comment est représenté un suspect, chaque suspect possède différentes caractéristiques, que ce soit leur nom, âge, sport et leur couleur de cheveux.
                    <br />
                    Par exemple, ici, nous avons <b>Ava</b>, qui a <b>40 ans</b>, qui pratique du <b>Basket</b> et du <b>Tennis</b>, qui a les cheveux <b>Roux</b> et qui possède <b>2 amis</b>.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 1 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={indicetxt} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>Les indices</Card.Title>
                  <Card.Text>
                    Dans ce jeu, chaque détective possède un indice, qui permet d'identifier une caractéristique du coupable, votre indice est le suivant :
                    <br />
                    "<u>Le suspect a entre 20 et 29 ans</u>".
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 3 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={joueurs} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Les Détectives</Card.Title>
                  <Card.Text>
                    Il est possible de voir les détectives sur le côté gauche de l'écran, ils sont représentés par des cercles de couleurs différentes. Le contour carré signifie que ce détective est en pleine réflexion.
                    <br />
                    Pour interroger un détective à propos d'un suspect, il suffit de le sélectionner, puis de cliquer sur le suspect que vous souhaitez. Il vous répondra donc ce qu'il pense de ce suspect selon son indice.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 4 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={rep} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Les réponses</Card.Title>
                  <Card.Text>
                    Les détéctives vous répondrons que par des ronds ou des carrés de leur couleur.
                    <br />
                    <ul>
                      <li>
                        Un <u>carré</u> signifie que son indice innocente le suspect.
                      </li>
                      <li>
                        Un <u>rond</u> signifie que son indice peut incréminer le suspect.
                      </li>
                    </ul>
                    Par exemple, ici :<br />
                    l'indice du détéctive Scooby-Doo (<u>Vert</u>) permet d'innocenter Logan.
                    <br/>Eleanor peut être suspectée par l'indice du détective Batman (<u>Jaune</u>).
                    <br/>Evelyn est innocentée par l'indice de <u>3 détéctive différents</u>.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 5 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Header>
                  <button className='button' 
                    style={{ 
                      backgroundColor: theme.colors.tertiary,
                      borderColor: theme.colors.secondary
                    }}>
                    <img src={Info} alt="info" height="40"/>
                  </button>
                </Card.Header>
                <Card.Body>
                  <Card.Title>Les règles du jeu</Card.Title>
                  <Card.Text>
                    Ce bouton vous mène à la page d'<b>information du jeu</b>, avec toutes les règles du jeu, que ce soit les objectifs, les indices, le déroulement, etc.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 2 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Header>
                  <button className='button' 
                    style={{ 
                      backgroundColor: theme.colors.tertiary,
                      borderColor: theme.colors.secondary
                    }}>
                    <img src={MGlass} alt="info" height="40"/>
                  </button>
                </Card.Header>
                <Card.Body>
                  <Card.Title>L'indice</Card.Title>
                  <Card.Text>
                    Ce bouton vous permet d'afficher votre indice personnel, gradez le secret ! Il s'agit de votre meilleur atout pour gagner.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 6 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={graph} style={{width:'auto', height:'300px'}}/>
                <Card.Body>
                  <Card.Title>Place à la pratique !</Card.Title>
                  <Card.Text>
                    Bien joué ! Vous avez maintenanttoutes les bases d'un veritable détéctive.
                    <br/>
                    Vous allez à présent avoir un exercice pratique pour la résolution d'une enquête, au côté de ces très chère Batman et Scooby-Doo.
                    <br/>
                    Cliquer sur "Poursuivre" pour commencer votre première partie.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}



          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <div style={{ width:'100%', display:'flex', justifyContent:'start'}}>
              <label style={{ color:'gray'}}>Étape {step+1}/7</label>
            </div>
            {/* <Button variant="secondary" onClick={handleCloseM}>
              Fermer
            </Button> */}
            { step != 0 && (<Button variant="primary" onClick={() => setStep(step - 1)}>Précédent</Button>)}
            { step === 6 ? (<Button variant="primary" onClick={handleCloseM}>Poursuivre</Button>) : 
            <Button variant="primary" onClick={() => setStep(step + 1)}>Suivant</Button>}
            
          </Modal.Footer>
        </Modal>

        <Modal
          show={showTuto2}
          onHide={handleCloseTuto2}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ maxHeight: '100vh'}}>
          <Modal.Header>
            <Modal.Title>Tutoriel</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step1} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>Premier pas</Card.Title>
                  <Card.Text>
                    Bienvenue dans cette seconde partie, où nous allons apprendre le déroulé d'une veritable enquête.
                    <br/>
                    Dans un premier temps, sélectionnez le joueur <b>Scooby-Doo</b> et questionnez le à propos du suspect nommé <b>Violet</b> en cliquant sur cette dernière.
                  </Card.Text>
                </Card.Body>
              </Card>

          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <Button variant="primary" onClick={handleCloseTuto2}>Compris !</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showTuto21}
          onHide={handleCloseTuto21}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ maxHeight: '100vh'}}>
          <Modal.Header>
            <Modal.Title>Tutoriel</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            {step === 0 && (
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step2} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>Votre premier tour</Card.Title>
                  <Card.Text>
                    Super, <u>Violet a été identifié par l'indice de Scooby-Doo</u>, c'est une information essentielle ! Cependant, cela ne signifie <i>pas forcément</i> qu'elle est coupable.
                    <br/>
                    C'est à présent le tour aux autres joueurs de jouer, regardons ce qu'ils ont fait.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 1 && (
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step3} style={{width:'200px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>Premier tour des autres joueurs</Card.Title>
                  <Card.Text>
                    Il semblerait que Scooby-Doo ait lui aussi interrogé Batman à propos de Violet, et que ce dernier ait répondu <b>non</b> par un carré.
                    Cela signifie que Violet n'est pas coupable, et qu'elle est donc innocente !
                    <br/>
                    Scooby-Doo a donc fait une erreur, en questionnant quelqu'un pouvant innocenter Violet. En guise de <b>punition</b>, il doit, lui aussi, poser un carré sur un autre joueur, révélant aussi plus d'information sur son indice.
                    Nous savons donc maintenant que l'indice de Scooby-Doo ne permet pas d'identifier Sebastian.
                    <br/>
                    Ensuite, Batman a questionné Scooby-Doo à propos de Charlotte, qui est identifié par l'indice de Scooby-Doo.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 2 && (
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step4} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>Second tour</Card.Title>
                  <Card.Text>
                    Vous remarquez que <u>votre indice identifie lui aussi Charlotte</u>, et si nous demandions à Batman, si ce dernier pense que Charlotte est la coupable ?
                    <br/>
                    Cela nous permettrait donc de mettre fin à la partie !
                  </Card.Text>
                </Card.Body>
              </Card>
            )}


          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <div style={{ width:'100%', display:'flex', justifyContent:'start'}}>
              <label style={{ color:'gray'}}>Étape {step+1}/3</label>
            </div>
            { step != 0 && (<Button variant="primary" onClick={() => setStep(step - 1)}>Précédent</Button>)}
            { step === 2 ? (<Button variant="primary" onClick={handleCloseTuto21}>Fermer</Button>) : 
            <Button variant="primary" onClick={() => setStep(step + 1)}>Suivant</Button>}
          </Modal.Footer>
        </Modal>

        <Modal
          show={showTuto22}
          onHide={handleCloseTuto22}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ maxHeight: '100vh'}}>
          <Modal.Header>
            <Modal.Title>Tutoriel</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step5} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>La punition</Card.Title>
                  <Card.Text>
                    Mince, il semblerait que l'indice de Batman innocente Charlotte, et que vous avez donc commit une erreur, la <b>punition</b> s'applique !
                    <br/>
                    Vous devez donc poser un <u>carré sur un autre joueur</u>, révélant ainsi plus d'information sur votre indice.
                    <br/>
                    Mais rien n'est joué ! Posons notre carré sur <b>Liam</b> pour cela, sélectionnez directement le suspect désiré.
                  </Card.Text>
                </Card.Body>
              </Card>
          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <Button variant="primary" onClick={handleCloseTuto22}>Compris !</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showTuto3}
          onHide={handleCloseTuto3}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ maxHeight: '100vh'}}>
          <Modal.Header>
            <Modal.Title>End Game</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step6} style={{width:'250px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title>La fin du jeu</Card.Title>
                  <Card.Text>
                    Ce tour est lui aussi riche en informations !
                    <br/>
                    Vous avez à présent assez d'information pour deviner les indices des autres : 
                    <ul>
                      <li>
                        Scooby-Doo semble avoir : <i>{indices[1]?.ToString(locale)}</i>.
                      </li>
                      <li>
                        Batman semble avoir : <i>{indices[2]?.ToString(locale)}</i>.
                      </li>
                      <li>
                        Et votre indice est : <i>{indices[0]?.ToString(locale)}</i>.
                      </li>
                    </ul>
                    Vous avez à présent toutes les cartes en main pour deviner qui est le coupable, cliquer sur le bouton <b>Ask Everyone</b>, puis séléctionné un suspect pour émettre une <b>accusation</b> pour deviner, bonne chance !
                  </Card.Text>
                </Card.Body>
              </Card>
          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <Button variant="primary" onClick={handleCloseTuto3}>Compris !</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  

export default Tutorial;