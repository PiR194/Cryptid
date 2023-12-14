import React, {useEffect, useState} from 'react';

/* Naviagtion */
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

/* Lang */
import { FormattedMessage } from 'react-intl';

/* Icon */
import { BiDoorOpen, BiLogInCircle } from 'react-icons/bi';
import { BsFillPersonPlusFill } from 'react-icons/bs';

/* Images */
import logo from '../res/img/logo2_preview_rev_1.png';
import defaultImg from '../res/img/Person.png';

/* Components */
import LanguageNavItem from './LangNavItem';
import LangDropDown from './LangDropDown';

/* Style */
import './NavBar.css';

/* Style */
import { useTheme } from '../Style/ThemeContext';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import {basePath} from "../AdressSetup"
import Player from '../model/Player';
import { set } from 'lodash';

// @ts-ignore
function AppNavbar({changeLocale, locale}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const {isLoggedIn, login, user, setUserData, manager } = useAuth();

    function navigateToProfile(){
        navigate(`${basePath}/profile`)
    }

    function navigateToLogin(){
        navigate(`${basePath}/login`)
    }
    
    function navigateToHome(){
        navigate(`${basePath}/`)
    }

    return (
        <Navbar expand="lg" className="custom-navbar" style={{ backgroundColor: theme.colors.primary }}>
            <Container>
                <Navbar.Brand onClick={navigateToHome}>
                    <img src={logo} alt="logo" className="logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={`${basePath}/`} style={{ color: theme.colors.text }}>
                            <FormattedMessage id="navbar.play" />
                        </Nav.Link>
                        <Nav.Link href={`${basePath}/presentation`} style={{ color: theme.colors.text }}>
                            <FormattedMessage id="navbar.presentation" />
                        </Nav.Link>
                        <Nav.Link href={`${basePath}/info`} style={{ color: theme.colors.text }}>
                            <FormattedMessage id="navbar.info" />
                        </Nav.Link>
                    </Nav>
                    <div className='leftdiv'>
                        <Nav className="ml-auto navbar-title-dd">
                            {isLoggedIn ? (
                                <>
                                    {/* Boutou qui lors du clique nous redirige vers le profile */}
                                    <Nav.Link onClick={navigateToProfile} style={{ color: theme.colors.text }}>
                                        <span>
                                            <img src={user? user.profilePicture : defaultImg} height="50" width="50" alt="profile"/>
                                            {user && user.pseudo}
                                        </span>
                                    </Nav.Link>
                                </>
                            ):(
                                <>
                                    {/* Bouton qui lors du clique nous redirige vers la connexion */}
                                    <Nav.Link onClick={navigateToLogin} style={{ color: theme.colors.text }}>
                                        <span>
                                            <img src={user?.profilePicture} height="50" width="50" alt="profile"/>
                                            {user && user.pseudo}
                                        </span>
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </div>
                </Navbar.Collapse>
                <LangDropDown changeLocale={changeLocale} locale={locale}/>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;