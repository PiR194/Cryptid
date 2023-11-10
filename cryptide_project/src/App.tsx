//import logo from './res/img/logo.svg';
import React from 'react';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';

/* Page */
import Home from './Pages/Home'; 
import Login from './Pages/LoginForm';
import SignUp from './Pages/SignUpForm';
import Play from './Pages/Play';
import Lobby from './Pages/Lobby';
import InGame from './Pages/InGame';

import EndGame from './Pages/EndGame';

/* Component */
import AppNavbar from './Components/NavBar';

/* nav */
import { BrowserRouter, Route, Routes } from "react-router-dom";

/* Style */
import './App.css';

/* bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

/* Internationnalisation */
import messagesFr from './Translations/fr.json';
import messagesEn from './Translations/en.json';

const messages = {
  fr: messagesFr,
  en: messagesEn,
};

function App() {
  
  //Language par defaut
  //const locale = 'fr'; 
  const [locale, setLocale] = useState('fr');

  //@ts-ignore
  const changeLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
  // <div className="App">
  //   <header className="App-header">
  //     <Home />
  //     <img src={logo} className="App-logo" alt="logo" />
  //   </header>
  // </div>
  //@ts-ignore
  <IntlProvider locale={locale} messages={messages[locale]}>
    <BrowserRouter>  
      <AppNavbar changeLocale={changeLocale} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/play" element={<Play/>} />
        <Route path="/lobby" element={<Lobby/>} />
        <Route path="/endgame" element={<EndGame/>} />
        <Route path="/game" element={<InGame/>} />
      </Routes>
    </BrowserRouter>
  </IntlProvider>
  );
}

export default App;

