import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link } from 'react-router-dom';
import LOGO from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";

const NavbarRPG: React.FC = () => {
  return (
    <Navbar expand="md" className="navbar-color" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to={"/"}>
          <img src={LOGO} height="60" className="" alt="D&D Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/caracteristicas">
              Características
            </Nav.Link>
            <NavDropdown title="Mestre" id="mestre-nav-dropdown">
              <NavDropdown.Item as={Link} to="/classes">
                Classes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/racas">
                Raças
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/backgrounds">
                Backgrounds
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tags">
                Tags
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/perguntas">
                Perguntas
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/questionarios">
                Questionários
              </NavDropdown.Item>
            </NavDropdown>
            <FontAwesomeIcon icon={faFolderOpen} style={{color: "white"}} className="fa-xl mx-2" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarRPG;
