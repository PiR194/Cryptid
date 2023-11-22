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

/* Components */
import LanguageNavItem from './LangNavItem';
import LangDropDown from './LangDropDown';

/* Style */
import './NavBar.css';

/* Style */
import { useTheme } from '../Style/ThemeContext';
import { useAuth } from '../Contexts/AuthContext';

// @ts-ignore
function AppNavbar({changeLocale}) {
    const theme = useTheme();
    const {isLoggedIn, logout} = useAuth();

    return (
        <Navbar expand="lg" className="custom-navbar" style={{ backgroundColor: theme.colors.primary }}>
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} alt="logo" className="logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title={<span style={{ color: theme.colors.text }}><FormattedMessage id="play" /></span>} className="navbar-title" id="basic-nav-dropdown">
                        <NavDropdown.Item href="play"><FormattedMessage id="play_solo" /> </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="play"><FormattedMessage id="create_room" /> </NavDropdown.Item>
                        <NavDropdown.Item href="play"><FormattedMessage id="join" /> </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <div className='leftdiv'>
                        <Nav className="ml-auto navbar-title-dd">
                        {isLoggedIn ? (
                            <NavDropdown
                                title={<span style={{ color: theme.colors.text }}>Menu <BiDoorOpen /></span>}
                                id="basic-nav-dropdown"
                                align="end"
                                drop='down-centered'
                            >
                            <NavDropdown.Item href="/profile">Profil</NavDropdown.Item>
                            <LanguageNavItem
                                countryCode="FR"
                                languageKey="languageSelector.french"
                                onClick={() => changeLocale('fr')}
                            />
                            <LanguageNavItem
                                countryCode="GB"
                                languageKey="languageSelector.english"
                                onClick={() => changeLocale('en')}
                            />
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>Déconnexion</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                            <Nav.Link href="/login" className='navbar-title-dd' style={{ backgroundColor: theme.colors.secondary }}>
                                <BiLogInCircle />
                                <FormattedMessage id="log_in" />
                            </Nav.Link>
                            <Nav.Link href="/signup" className='navbar-title-dd' style={{ backgroundColor: theme.colors.secondary }}>
                                <BsFillPersonPlusFill />
                                <FormattedMessage id="sign_up" />
                            </Nav.Link>
                            <LangDropDown changeLocale={changeLocale}/>
                            </>
                        )}
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
