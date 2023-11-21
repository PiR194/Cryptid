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

//@ts-ignore
function ScoreBoard({Player = null}) {
    const theme=useTheme();
    return (
        // <div className='LeaderBoardiv'>
        <div className='LeaderBoardiv'>
            <Tabs style={{width:"100%"}}
                defaultActiveKey="profile"
                id="ScoreBoard"
                className="mb-3">
                
                <Tab eventKey="perso" title="Vos Stats" disabled>
                    Tab content for Contact
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