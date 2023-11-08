import React from 'react';
import './Home.css'; // Créez un fichier CSS pour styliser votre composant
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
                <h2>L'HISTOIRE</h2>
                <p>
                    "La cryptozoologie étudie les traces des monstres de légende : les cryptides. Yétis, Chupacabra, bête du gévaudan, Dahut, ect., sont des sujets très sérieux pour vous… Croisez les indices et soyez le premier à les découvrir!"
                </p>
            </div>
            <div>
                <h2>LE JEU</h2>
                <p>
                    "Chaque joueur possède un indice sur le terrain où se trouve la créature. En recoupant vos informations, il ne peut y avoir qu'une case qui y corresponde. Mais le but est d'être le premier à la trouver. Interrogez vos collègues, et néanmoins concurrents. Ils ne peuvent vous répondre que par «non» ou «peut-être», avec beaucoup de logique et un brin d'audace, vous pourrez rentrer dans la légende!"
                </p>
            </div>
            <div>
                <h2>LES +</h2>
                <ul>
                    <li>Une mécanique de déduction époustouflante.</li>
                    <li>Une rejouabilité immense.</li>
                    <li>Un thème surprenant et fort.</li>
                </ul>
            </div>
        </div>
            
        <div className="vertical-divider"></div>

        <div className="right-section">
            <h3>Temps :45 minutes</h3>
            <h3>Joueurs :3 à 5 joueurs</h3>
            <h3>Age :10 ans et +</h3>
            <p>-------------------------------</p>
            <h3> <u>Créé par :</u><br/> Hal Duncan & Ruth Veevers</h3>
            <h3> <u>Illustré par :</u><br/> Kwanchai Moriya</h3>
            {/* <button>Jouer au jeu</button> */}
            <br/>
            <Link to="/jouer" className='button'>Aller à la page Page2</Link>
        </div>
    </div>
    );
}

export default Home;
