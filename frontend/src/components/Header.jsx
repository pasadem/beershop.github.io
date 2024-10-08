import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from '../assets/logo1.png'

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
            <Navbar.Brand href='/'>
              <img src={logo} alt=""/>
              BeerShop
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link href="/cart"><FaShoppingCart /> Корзина</Nav.Link>
                    <Nav.Link href="/user"><FaUser /> Зареєструватись</Nav.Link>
                </Nav>
            </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
