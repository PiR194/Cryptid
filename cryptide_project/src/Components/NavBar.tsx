import React from 'react';

/* Naviagtion */
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

/* Lang */
import { FormattedMessage } from 'react-intl';

/* Icon */
import { BiLogInCircle } from 'react-icons/bi';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { HiLanguage } from 'react-icons/hi2';

/* Components */
import './NavBar.css';

/* Style */
import { useTheme } from '../Style/ThemeContext';

// @ts-ignore
function AppNavbar({changeLocale}) {
    const theme = useTheme();
    return (
        <Navbar expand="lg" className="custom-navbar" style={{ backgroundColor: theme.colors.primary }}>
        <Container>
            <Navbar.Brand href="/">
                <div>
                    <h2 style={{color:theme.colors.text}}>Cryptide</h2>
                    <h6 style={{color:theme.colors.text}}>by Crypteam</h6>
                </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <NavDropdown title={<span style={{color:theme.colors.text}}><FormattedMessage id="play"/></span>} className="navbar-title" id="basic-nav-dropdown" >
                    <NavDropdown.Item href="play"><FormattedMessage id="play_solo"/> </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="play"><FormattedMessage id="create_room"/> </NavDropdown.Item>
                    <NavDropdown.Item href="play"><FormattedMessage id="join"/> </NavDropdown.Item>
                </NavDropdown>
            </Nav>
            <div className='leftdiv'>
                <Nav className="ml-auto navbar-title-dd">
                    <Nav.Link href="login" className='navbar-title-dd' style={{ backgroundColor: theme.colors.secondary }}> 
                        <BiLogInCircle/>
                        <FormattedMessage id="log_in"/> 
                    </Nav.Link>
                    <Nav.Link href="signup" className='navbar-title-dd' style={{ backgroundColor: theme.colors.secondary }}> 
                        <BsFillPersonPlusFill/>
                        <FormattedMessage id="sign_up"/> 
                    </Nav.Link>
                </Nav>
                <Nav className="me-auto">
                    <NavDropdown 
                    title={<span><HiLanguage /></span>}
                    className="navbar-title" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => changeLocale('fr')}> 
                            <FormattedMessage id="languageSelector.french"/> 
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => changeLocale('en')}> 
                            <FormattedMessage id="languageSelector.english"/> 
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </div>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default AppNavbar;
