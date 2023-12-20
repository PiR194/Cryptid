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

import detective from "../res/img/tuto/tuto-detective.jpg";
import ava from "../res/img/tuto/tuto-ava2.png";
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
import { FormattedMessage } from 'react-intl';


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
            navigate(``)
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
    setPlayersData([user, new EasyBot("Scooby-Doo", "Scooby-Doo", ImgBot), new EasyBot("Batman", "Batman", ImgBot)])
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
            <FormattedMessage id='aide'/>
          </Button>
          <Link to={`info`} target='_blank'>
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
            <Offcanvas.Title><FormattedMessage id='indice'/></Offcanvas.Title>
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
            <Modal.Title><FormattedMessage id='tutorial.title'/></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

          {step === -1 && (
            <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
              <Card.Img variant="top" src={detective} style={{width:'300px', height:'300px'}}/>
              <Card.Body>
                <Card.Title> <FormattedMessage id='tuto.title.1'/> </Card.Title>
                <Card.Text>
                  <FormattedMessage id='tuto.txt.1.1'/> <br/>
                  <FormattedMessage id='tuto.txt.1.2'/> <br/>
                  <FormattedMessage id='tuto.txt.1.3'/> <br/>
                  <FormattedMessage id='tuto.txt.1.4'/> <br/>
                  <FormattedMessage id='tuto.txt.1.5'/> <br/>
                  <i><FormattedMessage id='tuto.txt.1.6'/></i>
                </Card.Text>
              </Card.Body>
            </Card>
          )}
            {step === 0 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={ava} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title> <FormattedMessage id='tuto.title.2'/> </Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.2.1'/>
                    <br />
                    <FormattedMessage id='tuto.txt.2.2' /><b>Ava</b><FormattedMessage id='tuto.txt.2.2.1'/><b>40 <FormattedMessage id='age_indice_end'/></b><FormattedMessage id='tuto.txt.2.2.2'/><b><FormattedMessage id='basketball'/></b><FormattedMessage id='tuto.txt.2.2.3'/><b><FormattedMessage id='tennis'/></b><FormattedMessage id='tuto.txt.2.2.4'/><b><FormattedMessage id='redhead'/></b><FormattedMessage id='tuto.txt.2.2.5'/><b>2 <FormattedMessage id='nb_friends_indice_end'/></b> : Carter <FormattedMessage id='and'/> Liam.
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 1 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={indicetxt} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.3'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.3.1'/>
                    <br />
                    "<u><FormattedMessage id='tuto.txt.3.2'/></u>".
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 3 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={joueurs} style={{width:'auto', height:'300px'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.4'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.4.1'/>
                    <br />
                    <FormattedMessage id='tuto.txt.4.2'/>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 4 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={rep} style={{width:'300px', height:'300px'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.5'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.5.1'/>
                    <br />
                    <ul>
                      <li>
                        <FormattedMessage id='majUn'/> <u><FormattedMessage id='square'/></u> <FormattedMessage id='tuto.txt.5.2'/>.
                      </li>
                      <li>
                        <FormattedMessage id='majUn'/> <u><FormattedMessage id='round'/></u> <FormattedMessage id='tuto.txt.5.3'/>.
                      </li>
                    </ul>
                    <FormattedMessage id='tuto.txt.5.4'/><br />
                    <FormattedMessage id='tuto.txt.5.5.1'/>(<u><FormattedMessage id='color.green'/></u>) <FormattedMessage id='tuto.txt.5.5.2'/>.
                    <br/><FormattedMessage id='tuto.txt.5.6'/> (<u><FormattedMessage id='color.yellow'/></u>).
                    <br/><FormattedMessage id='tuto.txt.5.7.1'/><u><FormattedMessage id='tuto.txt.5.7.2'/></u>.
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
                  <Card.Title><FormattedMessage id='tuto.title.6'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.6.1.1'/><b><FormattedMessage id='tuto.txt.6.1.2'/></b><FormattedMessage id='tuto.txt.6.1.3'/>
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
                  <Card.Title><FormattedMessage id='tuto.title.7'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.7.1'/>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 6 && (
              <Card style={{ width: '90%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={graph} style={{width:'auto', height:'300px'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.8'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.8.1'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.8.2'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.8.3'/>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}



          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <div style={{ width:'100%', display:'flex', justifyContent:'start'}}>
              <label style={{ color:'gray'}}><FormattedMessage id='step'/> {step+1}/7</label>
            </div>
            { step != -1 && (<Button variant="primary" onClick={() => setStep(step - 1)}><FormattedMessage id='previous'/></Button>)}
            { step === 6 ? (<Button variant="primary" onClick={handleCloseM}><FormattedMessage id='continue'/></Button>) : 
            <Button variant="primary" onClick={() => setStep(step + 1)}><FormattedMessage id='next'/></Button>}
            
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
            <Modal.Title><FormattedMessage id='tutorial.title'/></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step1} style={{width:'auto', height:'300px'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.9'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.9.1'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.9.2.1'/><b>Scooby-Doo</b><FormattedMessage id='tuto.txt.9.2.2'/><b>Violet</b><FormattedMessage id='tuto.txt.9.2.3'/>
                  </Card.Text>
                </Card.Body>
              </Card>

          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <Button variant="primary" onClick={handleCloseTuto2}><FormattedMessage id='compris'/></Button>
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
            <Modal.Title><FormattedMessage id='tutorial.title'/></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            {step === 0 && (
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step2} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.10'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.10.1.1'/> <u><FormattedMessage id='tuto.txt.10.1.2'/></u><FormattedMessage id='tuto.txt.10.1.3'/><i><FormattedMessage id='tuto.txt.10.1.4'/></i><FormattedMessage id='tuto.txt.10.1.5'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.10.2'/>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 1 && (
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step3} style={{width:'200px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.11'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.11.1.1'/><b><FormattedMessage id='non'/></b><FormattedMessage id='tuto.txt.11.1.2'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.11.2.1'/><b><FormattedMessage id='tuto.txt.11.2.2'/></b><FormattedMessage id='tuto.txt.11.2.3'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.11.3'/>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {step === 2 && (
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step4} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.12'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.12.1.1'/><u><FormattedMessage id='tuto.txt.12.1.2'/></u><FormattedMessage id='tuto.txt.12.1.3'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.12.2'/>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}


          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <div style={{ width:'100%', display:'flex', justifyContent:'start'}}>
              <label style={{ color:'gray'}}><FormattedMessage id='step'/> {step+1}/3</label>
            </div>
            { step != 0 && (<Button variant="primary" onClick={() => setStep(step - 1)}><FormattedMessage id='previous'/></Button>)}
            { step === 2 ? (<Button variant="primary" onClick={handleCloseTuto21}><FormattedMessage id='close'/></Button>) : 
            <Button variant="primary" onClick={() => setStep(step + 1)}><FormattedMessage id='next'/></Button>}
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
            <Modal.Title><FormattedMessage id='tutorial.title'/></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>

              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step5} style={{width:'300px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.13'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.13.1.1'/><b><FormattedMessage id='tuto.txt.13.1.2'/></b><FormattedMessage id='tuto.txt.13.1.3'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.13.2.1'/><u><FormattedMessage id='tuto.txt.13.2.2'/></u><FormattedMessage id='tuto.txt.13.2.3'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.13.3.1'/><b>Liam</b> <FormattedMessage id='tuto.txt.13.3.2'/>
                  </Card.Text>
                </Card.Body>
              </Card>
          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <Button variant="primary" onClick={handleCloseTuto22}><FormattedMessage id='compris'/></Button>
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
            <Modal.Title>The End Game</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
              <Card style={{ width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <Card.Img variant="top" src={step6} style={{width:'250px', height:'auto'}}/>
                <Card.Body>
                  <Card.Title><FormattedMessage id='tuto.title.14'/></Card.Title>
                  <Card.Text>
                    <FormattedMessage id='tuto.txt.14.1'/>
                    <br/>
                    <FormattedMessage id='tuto.txt.14.2'/>
                    <ul>
                      <li>
                        <FormattedMessage id='tuto.txt.14.3'/><i>{indices[1]?.ToString(locale)}</i>.
                      </li>
                      <li>
                        <FormattedMessage id='tuto.txt.14.4'/><i>{indices[2]?.ToString(locale)}</i>.
                      </li>
                      <li>
                        <FormattedMessage id='tuto.txt.14.5'/><i>{indices[0]?.ToString(locale)}</i>.
                      </li>
                    </ul>
                    <FormattedMessage id='tuto.txt.14.6.1'/><b><FormattedMessage id='tuto.txt.14.6.2'/></b><FormattedMessage id='tuto.txt.14.6.3'/><b><FormattedMessage id='tuto.txt.14.6.4'/></b><FormattedMessage id='tuto.txt.14.6.5'/>
                  </Card.Text>
                </Card.Body>
              </Card>
          </Modal.Body>
          <Modal.Footer style={{display:'flex'}}>
            <Button variant="primary" onClick={handleCloseTuto3}><FormattedMessage id='compris'/></Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  

export default Tutorial;
