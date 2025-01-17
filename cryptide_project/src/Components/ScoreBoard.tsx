import React, {useState, useEffect} from 'react';
import Carousel from 'nuka-carousel';

/* Style */
import '../Pages/Play.css';
import '../Style/Global.css'
import './ScoreBoard.css';
import { useTheme } from '../Style/ThemeContext';

/* Ressources */
import trophy from '../res/icon/trophy.png'
import share from '../res/icon/share.png';

/* Boostrap */
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* Component */
import User from '../model/User';

/* Services */
import ScoreboardService from '../services/ScoreboardService';
import { BiLineChart, BiLineChartDown } from 'react-icons/bi';
import { CarouselCaption } from 'react-bootstrap';
import { BsLine } from 'react-icons/bs';

import { FormattedMessage, useIntl } from 'react-intl';

//@ts-ignore
const ScoreBoard: React.FC<{ Player: User }> = ({ Player }) => {
    const theme=useTheme();

    const [carouselKey, setCarouselKey] = useState(0);
    const [activeTab, setActiveTab] = useState("perso");

    // DAILY STATS
    const [dailyMastermindStats, setDailyMastermindStats] = useState<any>(null);
    const [dailyEasyEnigmaStats, setDailyEasyEnigmaStats] = useState<any>(null);
    const [dailyMediumEnigmaStats, setDailyMediumEnigmaStats] = useState<any>(null);
    const [dailyHardEnigmaStats, setDailyHardEnigmaStats] = useState<any>(null);
    const [dailyOnlineStats, setDailyOnlineStats] = useState<any>(null);

    // WEEKLY STATS
    const [weeklyMastermindStats, setWeeklyMastermindStats] = useState<any>(null);
    const [weeklyEasyEnigmaStats, setWeeklyEasyEnigmaStats] = useState<any>(null);
    const [weeklyMediumEnigmaStats, setWeeklyMediumEnigmaStats] = useState<any>(null);
    const [weeklyHardEnigmaStats, setWeeklyHardEnigmaStats] = useState<any>(null);
    const [weeklyOnlineStats, setWeeklyOnlineStats] = useState<any>(null);

    // Récupérer les records daily
    useEffect(() => {
        async function fetchDailyStats() {
            try {
                const resultMM = await ScoreboardService.getDailyMastermindStats();
                const resultEF = await ScoreboardService.getDailyEasyEnigmaStats();
                const resultEM = await ScoreboardService.getDailyMediumEnigmaStats();
                const resultED = await ScoreboardService.getDailyHardEnigmaStats();
                const resultOL = await ScoreboardService.getDailyOnlineStats(); 
                
                setDailyMastermindStats(resultMM);
                setDailyEasyEnigmaStats(resultEF);
                setDailyMediumEnigmaStats(resultEM);
                setDailyHardEnigmaStats(resultED);
                setDailyOnlineStats(resultOL);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchWeeklyStats() {
            try{
                const resultMM = await ScoreboardService.getWeeklyMastermindStats();
                const resultEF = await ScoreboardService.getWeeklyEasyEnigmaStats();
                const resultEM = await ScoreboardService.getWeeklyMediumEnigmaStats();
                const resultED = await ScoreboardService.getWeeklyHardEnigmaStats();
                const resultOL = await ScoreboardService.getWeeklyOnlineStats();

                setWeeklyMastermindStats(resultMM);
                setWeeklyEasyEnigmaStats(resultEF);
                setWeeklyMediumEnigmaStats(resultEM);
                setWeeklyHardEnigmaStats(resultED);
                setWeeklyOnlineStats(resultOL);
            } catch (error) {
                console.error(error);
            }
        }

        fetchDailyStats();
        fetchWeeklyStats();
    }, []);

    const intl = useIntl();


    //@ts-ignore
    const CustomPrevButton = ({ previousSlide }) => (
        <button className='carousselButton' onClick={previousSlide}>&lt;</button>
    );
    
    //@ts-ignore
    const CustomNextButton = ({ nextSlide }) => (
    <button className='carousselButton' onClick={nextSlide}>&gt;</button>
    );



    return (
        <Tabs
            activeKey={activeTab}
            onSelect={(key:any) => {
            setActiveTab(key);
            // Forcer une mise à jour du carousel
            setCarouselKey((prevKey) => prevKey + 1);
            }}
            id="ScoreBoard"
            className="tabsStats justify-content-around">
            <Tab eventKey="perso"
            title={intl.formatMessage({ id: 'score.tab.stat' })}
            disabled={!Player.pseudo.startsWith("Guest_") ? false : true}>
                <Tab.Content className={`tabsStats ${activeTab !== 'perso' ? 'hidden' : ''}`}>
                    <Carousel
                        renderCenterLeftControls={({ previousSlide }) => <CustomPrevButton previousSlide={previousSlide} />}
                        renderCenterRightControls={({ nextSlide }) => <CustomNextButton nextSlide={nextSlide} />}
                        adaptiveHeight
                        wrapAround
                        slidesToShow={1}
                        cellSpacing={10}
                        key={carouselKey}
                        >
                        <div className="stats">
                            <h5><FormattedMessage id='info.mdj.mastermind'/></h5>
                            <hr />
                            <p><FormattedMessage id='score.nbPlayed'/> : {Player.mastermindStats.nbGames}</p>
                            <p><FormattedMessage id='score.best'/>: {Player.mastermindStats.bestScore}</p>
                            <p><FormattedMessage id='score.moy'/>: {Player.mastermindStats.avgNbTry.toFixed(2)}</p>
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.easy'/></h5>
                            <hr />
                            <p><FormattedMessage id='score.nbPlayed'/>: {Player.easyEnigmaStats.nbGames}</p>
                            <p><FormattedMessage id='score.NbWin'/>: {Player.easyEnigmaStats.nbWins}</p>
                            <p><FormattedMessage id='score.ratio'/>: {Player.easyEnigmaStats.ratio.toFixed(2) + "%"}</p>
                            <p><FormattedMessage id='score.bestTmp'/>: {Player.easyEnigmaStats.bestTime + "s"}</p>
                            <p><FormattedMessage id='score.moyTmp'/>: {Player.easyEnigmaStats.avgTime.toFixed(2) + "s"}</p>
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.int'/></h5>
                            <hr />
                            <p><FormattedMessage id='score.nbPlayed'/>: {Player.mediumEnigmaStats.nbGames}</p>
                            <p><FormattedMessage id='score.best'/>: {Player.mediumEnigmaStats.bestScore}</p>
                            <p><FormattedMessage id='score.moy'/>: {Player.mediumEnigmaStats.avgNbTry.toFixed(2)}</p>
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.hard'/></h5>
                            <hr />
                            <p><FormattedMessage id='score.nbPlayed'/>: {Player.hardEnigmaStats.nbGames}</p>
                            <p><FormattedMessage id='score.NbWin'/>: {Player.hardEnigmaStats.nbWins}</p>
                            <p><FormattedMessage id='score.ratio'/>: {Player.hardEnigmaStats.ratio.toFixed(2) + "%"}</p>
                            <p><FormattedMessage id='score.bestTmp'/>: {Player.hardEnigmaStats.bestTime + "s"}</p>
                            <p><FormattedMessage id='score.moyTmp'/>: {Player.hardEnigmaStats.avgTime.toFixed(2) + "s"}</p>
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.online'/></h5>
                            <hr />
                            <p><FormattedMessage id='score.nbPlayed'/>: {Player.onlineStats.nbGames}</p>
                            <p><FormattedMessage id='score.NbWin'/>: {Player.onlineStats.nbWins}</p>
                            <p><FormattedMessage id='score.ratio'/>: {Player.onlineStats.ratio.toFixed(2) + "s"}</p>
                        </div>
                    </Carousel>
                </Tab.Content>
            </Tab>
            <Tab eventKey="daily" title={intl.formatMessage({ id: 'score.tab.quoti' })}>
                <Tab.Content className={`tabsStats ${activeTab !== 'daily' ? 'hidden' : ''}`}>
                    <Carousel adaptiveHeight wrapAround slidesToShow={1} cellSpacing={10} key={carouselKey}>
                        <div className="stats">
                            <h5><FormattedMessage id='info.mdj.mastermind'/></h5>
                            <hr />
                            {dailyMastermindStats !== null ? (dailyMastermindStats.tab.length !== 0 ? dailyMastermindStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.score + " essai(s)"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.easy'/></h5>
                            <hr />
                            {dailyEasyEnigmaStats !== null ? (dailyEasyEnigmaStats.tab.length !== 0 ? dailyEasyEnigmaStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.time + "s"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.int'/></h5>
                            <hr />
                            {dailyMediumEnigmaStats !== null ? (dailyMediumEnigmaStats.tab.length !== 0 ? dailyMediumEnigmaStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.time + "s"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.hard'/></h5>
                            <hr />
                            {dailyHardEnigmaStats !== null ? (dailyHardEnigmaStats.tab.length !== 0 ? dailyHardEnigmaStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.time + "s"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.online'/></h5>
                            <hr />
                            {dailyOnlineStats !== null ? (dailyOnlineStats.tab.length !== 0 ? dailyOnlineStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.wins + " victoires"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                    </Carousel>
                </Tab.Content>
            </Tab>
            <Tab eventKey="weekly" title={intl.formatMessage({ id: 'score.tab.hebdo' })}>
                <Tab.Content className={`tabsStats ${activeTab !== 'weekly' ? 'hidden' : ''}`}>
                    <Carousel adaptiveHeight wrapAround slidesToShow={1} cellSpacing={10} key={carouselKey}>
                        <div className="stats">
                            <h5><FormattedMessage id='info.mdj.mastermind'/></h5>
                            <hr />
                            {weeklyMastermindStats !== null ? (weeklyMastermindStats.tab.length !== 0 ? weeklyMastermindStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.score + " essai(s)"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.easy'/></h5>
                            <hr />
                            {weeklyEasyEnigmaStats !== null ? (weeklyEasyEnigmaStats.tab.length !== 0 ? weeklyEasyEnigmaStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.time + "s"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.int'/></h5>
                            <hr />
                            {weeklyMediumEnigmaStats !== null ? (weeklyMediumEnigmaStats.tab.length !== 0 ? weeklyMediumEnigmaStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.time + "s"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.hard'/></h5>
                            <hr />
                            {weeklyHardEnigmaStats !== null ? (weeklyHardEnigmaStats.tab.length !== 0 ? weeklyHardEnigmaStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.time + "s"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                        <div className="stats">
                            <h5><FormattedMessage id='score.titre.online'/></h5>
                            <hr />
                            {weeklyOnlineStats !== null ? (weeklyOnlineStats.tab.length !== 0 ? weeklyOnlineStats.tab.map((stats: any, index: number) => (
                                <>
                                    <Row>
                                        <Col>
                                            <p>{index+1}.{stats.pseudo}</p>
                                        </Col>
                                        <Col>
                                            <p>{stats.wins + " victoires"}</p>
                                        </Col>
                                    </Row>
                                </>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )) : (
                                <p className='text-warning'><FormattedMessage id='score.nothing'/></p>
                            )}
                        </div>
                    </Carousel>
                </Tab.Content>
            </Tab>
        </Tabs>
    );
}

export default ScoreBoard;