import React from 'react';

/* Style */
import '../Pages/Play.css';
import '../Style/Global.css'
import { useTheme } from '../Style/ThemeContext';

/* Ressources */
import Person from '../res/img/Person.png'
import leave from '../res/img/bot.png'
import trophy from '../res/icon/trophy.png'
import share from '../res/icon/share.png';

/* Boostrap */
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* Component */
import ButtonImgNav from './ButtonImgNav';
import User from '../model/User';

/* Types */

//@ts-ignore
const ScoreBoard: React.FC<{ Player: User }> = ({ Player }) => {
    const theme=useTheme();

    return (
        // <div className='LeaderBoardiv'>
        <div className='LeaderBoardiv'>
            <Tabs style={{width:"100%"}}
                defaultActiveKey="daily"
                id="ScoreBoard"
                className="mb-3">
                <Tab eventKey="perso" title="Vos Stats" disabled = { !Player.pseudo.startsWith("Guest_") ? false : true}>
                <Container fluid>
                        <Row>Stats en MasterMind :</Row>
                        <Row>
                            <Col sm={10}>Partie Jouées :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.mastermindStats.nbGames : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Best-Score :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.mastermindStats.bestScore : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Moyenne d'essai :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.mastermindStats.avgNbTry.toFixed(2) : "0"}</Col>
                        </Row>
                        <hr/>
                        <Row>Stats en Enigme facile :</Row>
                        <Row>
                            <Col sm={10}>Partie jouée :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.easyEnigmaStats.nbGames : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Nombre de victoire :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.easyEnigmaStats.nbWins : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Ratio V/D :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.easyEnigmaStats.ratio.toFixed(2) + "%" : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Meilleur temps :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.easyEnigmaStats.bestTime : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Moyenne de temps :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.easyEnigmaStats.avgTime.toFixed(2) : "0"}</Col>
                        </Row>
                        <hr/>
                        <Row>Stats en Enigme moyenne :</Row>
                        <Row>
                            <Col sm={10}>Partie jouée :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.mediumEnigmaStats.nbGames : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Best-Score :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.mediumEnigmaStats.bestScore : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Moyenne d'essai :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.mediumEnigmaStats.avgNbTry.toFixed(2) : "0"}</Col>
                        </Row>
                        <hr/>
                        <Row>Stats en Enigme difficile :</Row>
                        <Row>
                            <Col sm={10}>Partie jouée :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.hardEnigmaStats.nbGames : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Meilleur temps :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.hardEnigmaStats.bestTime : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Moyenne de temps :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.hardEnigmaStats.avgTime.toFixed(2) : "0"}</Col>
                        </Row>
                        <hr/>
                        <Row>Stats en ligne :</Row>
                        <Row>
                            <Col sm={10}>Partie jouée :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.onlineStats.nbGames : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Nombre de victoire :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.onlineStats.nbWins : "0"}</Col>
                        </Row>
                        <Row>
                            <Col sm={10}>Ratio V/D :</Col>
                            <Col className='leftRow'>{Player !== null ? Player.onlineStats.ratio.toFixed(2) + "%" : "0"}</Col>
                        </Row>
                    </Container>
                </Tab>
                <Tab eventKey="daily" title="Daily"
                    style={{display:"flex", flexDirection:'column', alignItems:'center'}}>
                    <img src={trophy}
                            height='100'
                            width='100'
                            alt="Person2"/>
                    <Container fluid>
                        <Row>
                            <Col sm={8}>Partie Jouées :</Col>
                            <Col className='leftRow'>10</Col>
                        </Row>
                        <Row>
                            <Col sm={8}>Partie gagnées :</Col>
                            <Col className='leftRow'>2</Col>
                        </Row>
                        <Row>
                            <Col sm={8}>Pions posés :</Col>
                            <Col className='leftRow'>2</Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col sm={8}>Partie solo :</Col>
                            <Col className='leftRow'>21</Col>
                        </Row>
                        <Row>
                            <Col sm={8}>Nombre de coups moyen :</Col>
                            <Col className='leftRow'>19</Col>
                        </Row>
                    </Container>
                </Tab>
                <Tab eventKey="weekly" title="Weekly">
                    <img src={trophy}
                                height='100'
                                width='100'
                                alt="Person2"/>
                </Tab>
            </Tabs>
            
                <ButtonImgNav dest='/' img={share}/>
                </div>
        //</div>
    );
}

export default ScoreBoard;
