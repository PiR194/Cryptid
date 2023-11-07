//import logo from './res/img/logo.svg';
import React from 'react';

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


function App() {
  return (
  // <div className="App">
  //   <header className="App-header">
  //     <Home />
  //     <img src={logo} className="App-logo" alt="logo" />
  //   </header>
  // </div>

  <BrowserRouter>  
    <AppNavbar />
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/jouer" element={<Jouer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

