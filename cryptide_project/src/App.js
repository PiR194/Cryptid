//import logo from './res/img/logo.svg';
import React from 'react';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';

/* Page */
import Home from './Pages/Home'; 
import Jouer from './Pages/Jouer'; 
import Login from './Pages/LoginForm.js';
import SignUp from './Pages/SignUpForm.js';

/* Component */
import AppNavbar from './Components/NavBar.js';

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
  <IntlProvider locale={locale} messages={messages[locale]}>
    <BrowserRouter>  
      <AppNavbar changeLocale={changeLocale} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/jouer" element={<Jouer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </IntlProvider>
  );
}

export default App;

