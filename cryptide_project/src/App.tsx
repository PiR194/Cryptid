//import logo from './res/img/logo.svg';
import React from 'react';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { GameProvider } from './Contexts/GameContext';
import { AuthProvider } from './Contexts/AuthContext';

/* Page */
import Home from './Pages/Home'; 
import Login from './Pages/LoginForm';
import SignUp from './Pages/SignUpForm';
import NewPlay from './Pages/NewPlay';
import Profile from './Pages/Profile';
import Lobby from './Pages/Lobby';
import InGame from './Pages/InGame';
import EndGame from './Pages/EndGame';
import InfoPage from './Pages/InfoPage';

import DeducGrid from './Pages/DeducGrid'; 
import Lobbies from './Pages/Lobbies';

/* Component */
import AppNavbar from './Components/NavBar';

/* nav */
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

/* Style */
import './App.css';

import { ThemeProvider } from './Style/ThemeContext';
// import theme from './Style/Theme';

/* bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

/* Internationnalisation */
import messagesFr from './Translations/fr.json';
import messagesEn from './Translations/en.json';
import messagesEs from './Translations/es.json';
import messagesPt from './Translations/pt.json';
import messagesRu from './Translations/ru.json';


/* Gestion d' erreur */
import ErrorBoundary from './Error/ErrorBoundary';
import ErrorPage from './Error/ErrorPage';
import DeducCheck from './Pages/DeducCheck';
import {basePath} from "./AdressSetup"
import Tutorial from './Pages/Tutorial';



const messages = {
  fr: messagesFr,
  en: messagesEn,
  es: messagesEs,
  pt: messagesPt,
  ru: messagesRu,
};

function App() {
  
  //Language par defaut
  //const locale = 'fr'; 
  const [locale, setLocale] = useState('fr');

  //@ts-ignore
  const changeLocale = async (newLocale) => {
    setLocale(newLocale);
  };

  console.log(basePath)


  //const location = useLocation();
  const hasNavbarVisible = [basePath + "/", basePath + "/login", basePath + "/signup", basePath + "/lobby", basePath + "/endgame", basePath + "/deduc"]//.includes(window.location.pathname);

  document.title = "Social Graph"; 

  return (
    <ErrorBoundary fallback={(error, errorInfo) => <ErrorPage />}>
      <AuthProvider>
        <GameProvider>
          {/*@ts-ignore*/}
          <IntlProvider locale={locale} messages={messages[locale]}>
            <ThemeProvider>
              <BrowserRouter>  
                {hasNavbarVisible && <AppNavbar changeLocale={changeLocale} locale={locale} />}
                <Routes>
                
                  <Route path={``} element={<NewPlay/>} />
                  <Route path={`login`} element={<Login />} />
                  <Route path={`signup`} element={<SignUp />} />
                  <Route path={`presentation`} element={<Home />} />
                  <Route path={`lobby`} element={<Lobby/>} />
                  <Route path={`endgame`} element={<EndGame lang={locale}/>} />
                  <Route path={`game`} element={<InGame locale={locale} changeLocale={changeLocale}/>}/>
                  <Route path={`info`} element={<InfoPage locale={locale} changeLocale={changeLocale}/>} />
                  <Route path={`tutorial`} element={<Tutorial locale={locale} changeLocale={changeLocale}/>} />
                  <Route path={`deduc`} element={<DeducCheck lang={locale}/>} />
                  <Route path={`TheRealDeduc`} element={<DeducGrid/>} />
                  <Route path={`profile`} element={<Profile/>} />
                  <Route path={`join`} element={<Lobbies/>}/>
                  {/* <Route path="/solo" element={<SoloGame locale={locale} changeLocale={changeLocale} />}/>   */}

                  <Route path="*" element={<ErrorPage code="404" msg='not found' />} /> {/* page 404 */}
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </IntlProvider>
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

