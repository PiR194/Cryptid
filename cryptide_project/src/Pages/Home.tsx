import React from 'react';
import './Home.css';
import '../App.css';
import { Link } from 'react-router-dom';
import Person from '../source/Person';
import Color from '../source/Color';
import Sport from '../source/Sport';
import PersonNetwork from '../source/PersonsNetwork';
import AgeIndice from '../source/Indices/AgeIndice';
import IndiceTesterFactory from '../source/Factory/IndiceTesterFactory';
import NbEdgesIndice from '../source/Indices/NbEdgesIndice';
import ColorIndice from '../source/Indices/ColorIndice';
import EdgesCreator from '../source/EdgesCreator';
import ColorEdgesIndice from '../source/Indices/ColorEdgesIndice';
import IndiceChooser from '../source/IndiceChooser';
import Indice from '../source/Indices/Indice';
import SportIndice from '../source/Indices/SportIndice';
import Stub from '../source/Stub';
import NetworkGenerator from '../source/NetworkGenerator';
import GraphCreator from '../source/GraphCreator';







function Home() {
    /*
    let person = new Person(0, "test", 23, Color.BLANC, [Sport.CURLING], []);
    let p1 = new Person(1, "1", 51, Color.BLOND, [Sport.CURLING], [])
    let p2 = new Person(2, "2", 20, Color.NOIR, [Sport.BASKET], [])
    let p3 = new Person(3, "3", 25, Color.ROUX, [Sport.TENNIS], [])
    let p4 = new Person(5, "5", 51, Color.BLOND, [Sport.FOOT], [])
    let p5 = new Person(6, "6", 27, Color.CHATAIN, [Sport.RUGBY], [])
    let p6 = new Person(7, "7", 40, Color.ROUX, [Sport.FOOT], [])
    let p7 = new Person(8, "8", 51, Color.CHATAIN, [Sport.TENNIS], [])
    let p8 = new Person(9, "9", 28, Color.BLANC, [Sport.BASKET], [])
    let p9 = new Person(10, "10", 40, Color.ROUX, [Sport.RUGBY], [])
    let network = new PersonNetwork([person, p1, p2, p3, p4, p5, p6, p7, p8, p9])
    */

    const edgesCreator = new EdgesCreator()

    const chooser = new IndiceChooser()

    const indices = Stub.GenerateIndice()

    const network = NetworkGenerator.GenerateNetwork(12)

    const rand = Math.floor(Math.random() * 12)
    const person = network.getPersons()[rand]

    const choosenIndices = chooser.chooseIndice(network, person, indices, 3)

    edgesCreator.CreateAllEdges(network, person, choosenIndices)

    const graph = GraphCreator.CreateGraph(network)

    console.log(network)
    console.log(graph)

    return (
        
    <div className="home-container">

        <div className="left-section">

            <div>
                <h2><FormattedMessage id="home.histoire.title"/></h2>
                <p>
                    <FormattedMessage id="home.histoire" />
                </p>
            </div>
            <div>
                <h2><FormattedMessage id="home.jeu.title"/></h2>
                <p>
                    <FormattedMessage id="home.jeu" />
                </p>
            </div>
            <div>
                <h2><FormattedMessage id="home.plus.title"/></h2>
                <ul>
                    <li><FormattedMessage id="home.plus.1"/></li>
                    <li><FormattedMessage id="home.plus.2"/></li>
                    <li><FormattedMessage id="home.plus.3"/></li>
                </ul>
            </div>
        </div>
            
        <div className="vertical-divider"></div>

        <div className="right-section">
            <h3><FormattedMessage id="game.time"/></h3>
            <h3><FormattedMessage id="game.players"/></h3>
            <h3><FormattedMessage id="game.age"/></h3>
            <p>-------------------------------</p>
            <h3> <u><FormattedMessage id="game.createdBy"/></u><br/> Hal Duncan & Ruth Veevers</h3>
            <h3> <u><FormattedMessage id="game.illustratedBy"/></u><br/> Kwanchai Moriya</h3>
            {/* <button>Jouer au jeu</button> */}
            <br/>
            <Link to="/play" className='button'> <FormattedMessage id="play"/> </Link>
        </div>
    </div>
    );
}

export default Home;
