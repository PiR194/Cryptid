import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { BiLogInCircle } from 'react-icons/bi';
import { BsFillPersonPlusFill } from 'react-icons/bs'

import './NavBar.css';

function AppNavbar({ changeLocale }) {
    return (
        <Navbar expand="lg" className="custom-navbar">
        <Container>
            <Navbar.Brand href="/">
                <div>
                    <h2>Cryptide</h2>
                    <h6>by Crypteam</h6>
                </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <NavDropdown title="Jouer" className="navbar-title" id="basic-nav-dropdown">
                    <NavDropdown.Item href="jouer">Jouer solo</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="jouer">Créer une partie</NavDropdown.Item>
                    <NavDropdown.Item href="jouer">Rejoindre</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            <div className='leftdiv'>
                <Nav className="ml-auto navbar-title-dd">
                    <Nav.Link href="login" className='navbar-title-dd'> <BiLogInCircle/> Log in</Nav.Link>
                    <Nav.Link href="signup" className='navbar-title-dd'> <BsFillPersonPlusFill/> Sign up</Nav.Link>
                </Nav>
                <Nav className="me-auto">
                    <NavDropdown title="Language" className="navbar-title" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => changeLocale('fr')}>Français</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => changeLocale('en')}>Anglais</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </div>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default AppNavbar;
