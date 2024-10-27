import { Button, Container, Dropdown, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faFileArrowDown, faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { exportDexieToJSON, importJSONFromFile } from "../database/db";
import React from "react";
import { useToast } from "../context/ToastContext";

const NavbarRPG: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

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
      try {
        await importJSONFromFile(file);
        showToast("Dados importados com sucesso! Recarregando página em 3 segundos", "success");
        setTimeout(() => navigate(0), 3000);
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message, "danger");
        } else {
          console.error(error);
          showToast("Ocorreu um erro desconhecido", "danger");
        }
      }
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
            <Nav.Link
              as={Link}
              className="show-text"
              target="_blank"
              rel="noopener noreferrer"
              to="https://github.com/RPG-Engineers/Quiz-RPG"
            >
              Github
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <a
              href="https://github.com/RPG-Engineers/Quiz-RPG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2 hidden-icon"
            >
              <FontAwesomeIcon icon={faGithub} className="fa-xl" />
            </a>
            <Dropdown>
              <Dropdown.Toggle variant="link" id="export-dropdown" className="remover-seta">
                <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} className="fa-xl mx-2 hidden-icon" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item as="button" onClick={handleExportClick}>
                  <div className="px-2 py-1">
                    <FontAwesomeIcon icon={faFileArrowUp} className="fa-xl mx-2" />
                    <span>Exportar dados</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={handleImportClick}>
                  <div className="px-2 py-1">
                    <FontAwesomeIcon icon={faFileArrowDown} className="fa-xl mx-2" />
                    <span>Importar dados</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarRPG;
