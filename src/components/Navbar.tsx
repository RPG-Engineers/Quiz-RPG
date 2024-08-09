import { Button, Container, Dropdown, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faFileArrowDown, faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { exportDexieToJSON, importJSONFromFile } from "../database/db";
import React from "react";

const NavbarRPG: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Função de exportação
  const handleExportClick = async () => {
    await exportDexieToJSON();
  };

  // Função para disparar o clique no input de arquivo
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Função de importação
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await importJSONFromFile(file);
      navigate(0);
    }
  };
  return (
    <Navbar expand="md" className="navbar-color custom-nav-link" data-bs-theme="dark">
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
            <NavDropdown title="Importar/Exportar Dados" id="export-nav-dropdown" className="show-text">
              <Dropdown.Item as="button">
                <Button variant="button">
                  <FontAwesomeIcon icon={faFileArrowUp} className="fa-xl mx-2" />
                  Exportar dados
                </Button>
              </Dropdown.Item>
              <Dropdown.Item as="button">
                <Button variant="button">
                  <FontAwesomeIcon icon={faFileArrowDown} className="fa-xl mx-2" />
                  Importar dados
                </Button>
              </Dropdown.Item>
            </NavDropdown>
          </Nav>
          <Dropdown>
            <Dropdown.Toggle variant="link" id="export-dropdown" className="remover-seta">
              <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} className="fa-xl mx-2 hidden-icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item as="button" onClick={handleExportClick}>
                <Button variant="button">
                  <FontAwesomeIcon icon={faFileArrowUp} className="fa-xl mx-2" />
                  Exportar dados
                </Button>
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={handleImportClick}>
                <Button variant="button">
                  <FontAwesomeIcon icon={faFileArrowDown} className="fa-xl mx-2" />
                  Importar dados
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarRPG;
