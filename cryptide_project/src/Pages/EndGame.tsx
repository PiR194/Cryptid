import React,  {useEffect, useState} from 'react';


/* Style */
import './EndGame.css';
import '../Style/Global.css';
import { useTheme } from '../Style/ThemeContext';

/* res */
import Person from '../res/img/Person.png';
import Leave from '../res/icon/leave.png';
import Replay from '../res/icon/replay.png';

/* sound */
import WinSound from '../res/Audio/win.wav';

/* Component */
import PersonStatus from '../Components/PersonStatus';
import ButtonImgNav from '../Components/ButtonImgNav';
import BigButtonNav from '../Components/BigButtonNav';
//
import { Network } from "vis-network/standalone/esm/vis-network";
import { map } from 'lodash';

/* Nav */
import { Link } from 'react-router-dom';

/* Lang */
import { FormattedMessage } from 'react-intl';

/* Model */
import Player from '../model/Player';

/* Context  */
import { useGame } from '../Contexts/GameContext';

/* Boostrap */
import { Button, Col, Container, Row } from 'react-bootstrap';
import Bot from '../model/Bot';
import {basePath} from "../AdressSetup"



function EndGame({lang}: {lang: string}) {
    const {networkData, seed} = useGame();
    const params = new URLSearchParams(window.location.search);
    
    const initialOptions = {

        layout: {
            improvedLayout: true,
            randomSeed: seed,
            hierarchical: {
                enabled: false,
                direction: 'LR',
                sortMethod: 'hubsize'
            },
            //randomSeed: 2
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -1000,
                springConstant: 0.001,
                springLength: 100
            }
        }
    };

    useEffect(() => {
        handleWinSound();
    }, []);


    useEffect(() => {
        const container = document.getElementById("vis-graph");
        if (!container) {
            console.error("Container not found");
            return;
        }
        const network = new Network(container, networkData, initialOptions);
        console.log(networkData)
    
    }, []);



    //* Gestion solo
    let IsSolo: boolean = false
    const solotmp = params.get('solo');
    if (solotmp == "true"){
        IsSolo=true
    }


    //* Gestion daily
    let IsDaily: boolean = false
    const dailytmp = params.get('daily');
    if (dailytmp == "true"){
        IsDaily=true
    }

    const {reset} = useGame()
    
    const resetAll = () => {
        reset()
    }
    
    const {winner, person, players, indices, nbCoup, temps} =useGame()
    
    let indice = indices[0]
    let losingPlayers : Player[];
    
    if(!IsSolo){
        const index = players.findIndex((p) => p.id == winner?.id)
        if (index != -1) {
            indice = indices[index]
        }
        
        if (winner != null) {
            losingPlayers = players.filter(player => player.id !== winner.id);
        } else {
            losingPlayers = players;
        }
    }
    else{
        losingPlayers = [];
    }
    const theme = useTheme();


    let indicenull = false;
    if (indices.length == 0){
        indicenull = true;
    }

    //* Sound
    const [playTurnSound, setPlayTurnSound] = useState(false);

    const handleWinSound = () => {
        setTimeout(() => { // on attend 1s avant de jouer le son
            setPlayTurnSound(true);
        }, 300);

        setTimeout(() => { // on attend 2s avant de remettre le son à false
        setPlayTurnSound(false);
        }, 2000);
    };
    return (
        <div style={{overflow:"hidden"}}>
            {playTurnSound && <audio src={WinSound} autoPlay />}
            {!IsSolo ? (
                <Container>
                    {/* Winner et son indice */}
                    <Row>
                        <Col>
                            <div className="losingPlayersContainer">
                                {/* Indices pairs */}
                                {players.map((player, index) => (
                                    index % 2 == 0 && (
                                        <div className="playerContainer" key={index}>
                                            <PersonStatus img={Person} state={Person} key={index} name={player.pseudo} playerTouched={1} setPlayerTouched={() => {}} index={index} playerIndex={-2} showCircle={false} askedWrong={false}/>
                                            {!indicenull && (<h6 className='indiceDisplay'>{indices[players.findIndex((p) => p.id == player?.id)].ToString(lang)}</h6>)}
                                        </div>
                                    )
                                ))}
                            </div>
                        </Col>

                        <Col xs={6}>
                            <Row>
                                <div className="head">
                                    <header className='leaderboard-header' style={{ borderColor: theme.colors.primary }}>
                                        <h4>{winner?.pseudo} a gagné !</h4>
                                        <h5>Le coupable était <u>{person?.getName()}</u></h5>
                                    </header>
                                </div>
                            </Row>
                            <Row>
                                <div id="vis-graph"></div>
                            </Row>

                            <Row className="justify-content-md-center">
                                <Button href={`${basePath}/`} style={{
                                    width:"50%",
                                    margin:"10px"
                                }}>Retour à l'accueil</Button>
                            </Row>
                        </Col>

                        <Col>
                            <div className="losingPlayersContainer">
                                {players.map((player, index) => (
                                    index % 2 == 1 && (
                                        <div className="playerContainer" key={index}>
                                            <PersonStatus img={Person} state={Person} key={index} name={player.pseudo} playerTouched={1} setPlayerTouched={() => {}} index={index} playerIndex={-2} showCircle={false} askedWrong={false}/>
                                            {!indicenull && (<h6 className='indiceDisplay'>{indices[players.findIndex((p) => p.id == player?.id)].ToString(lang)}</h6>)}
                                        </div>
                                    )
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            ): (
                <Container fluid>
                    {/* Perd une énigme */}
                    {!winner && (
                        <Row>
                            <Col>
                                <Row>
                                    <div className="head">
                                        <header className='leaderboard-header' style={{ borderColor: theme.colors.primary }}>
                                            <h4>Vous avez perdu !</h4>
                                            <h5>Le coupable était <u>{person?.getName()}</u></h5>
                                        </header>
                                    </div>

                                    <Row>
                                        {!IsDaily && 
                                            <Col className='center'>
                                                <p className='solostat'>Nombre de coups : {nbCoup}</p>
                                            </Col>
                                        }

                                        <Col className='center'>
                                            <p className='solostat'>Temps : {temps}s</p>
                                        </Col>
                                    </Row>
                                </Row>

                                <Row>
                                    <Col>
                                        {indices.map((indice, index) => (
                                            index % 2 == 0 && (
                                                <div className='playerContainer'>
                                                    <h6 className='indiceDisplay'> <u>Indice {index+1}</u> : {indice.ToString("fr")}</h6>
                                                </div>
                                            )
                                        ))}
                                    </Col>

                                    <Col xs={6}>
                                        <div id="vis-graph"></div>
                                    </Col>

                                    <Col>
                                        <div className="losingPlayersContainer">
                                            {indices.map((indice, index) => (
                                                index % 2 == 1 && (
                                                    <div className='playerContainer'>
                                                        <h6 className='indiceDisplay'> <u>Indice {index+1}</u> : {indice.ToString("fr")}</h6>
                                                    </div>  
                                                )
                                            ))}
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center">

                                    <Button href={`${basePath}/`} style={{
                                        width:"50%",
                                        margin:"10px"
                                    }}>Retour à l'accueil</Button>
                                </Row>
                            </Col>
                        </Row>
                    )}        

                    {/* Gagne une énigme */}
                    {winner && (
                        <Row>
                            <Col>
                                <Row>
                                    <div className="head">
                                        <header className='leaderboard-header' style={{ borderColor: theme.colors.primary }}>
                                            <h4>Vous avez gagné !</h4>
                                            <h5>Le coupable était <u>{person?.getName()}</u></h5>
                                        </header>
                                    </div>

                                    <Row>
                                        {!IsDaily && 
                                            <Col className='center'>
                                                <p className='solostat'>Nombre de coups : {nbCoup}</p>
                                            </Col>
                                        }

                                        <Col className='center'>
                                            <p className='solostat'>Temps : {temps}s</p>
                                        </Col>
                                    </Row>
                                </Row>

                                <Row>
                                    <Col>
                                        {indices.map((indice, index) => (
                                            index % 2 == 0 && (
                                                <div className='playerContainer'>
                                                    <h6 className='indiceDisplay'> <u>Indice {index+1}</u> : {indice.ToString("fr")}</h6>
                                                </div>
                                            )
                                        ))}
                                    </Col>

                                    <Col xs={6}>
                                        <div id="vis-graph"></div>
                                    </Col>

                                    <Col>
                                        <div className="losingPlayersContainer">
                                            {indices.map((indice, index) => (
                                                index % 2 == 1 && (
                                                    <div className='playerContainer'>
                                                        <h6 className='indiceDisplay'> <u>Indice {index+1}</u> : {indice.ToString("fr")}</h6>
                                                    </div>  
                                                )
                                            ))}
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='justify-content-center'>
                                    <Button href={`${basePath}/`} style={{
                                        width:"50%",
                                        margin:"10px"
                                    }}>Retour à l'accueil</Button>   
                                </Row>
                            </Col>
                        </Row>    
                    )}        
                </Container>
            )}
        </div>
    );
}

export default EndGame;
