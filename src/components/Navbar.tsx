import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faFileArrowDown, faFileArrowUp, faLink, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Container, Dropdown, Modal, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../assets/img/logo.png";
import { useToast } from "../context/ToastContext";
import { downloadDexieToJSON, exportDexieToJSON, importJSONFromFile, resetToDefault } from "../database/db";

const NavbarRPG: React.FC = () => {
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Função de exportação
  const handleExportClick = async () => {
    await downloadDexieToJSON();
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
        console.error(error);
        showToast("Ocorreu um erro ao importar os dados", "danger");
      }
    }
  };

  // Função para abrir o modal
  const handleShowResetModal = () => setShowResetModal(true);

  // Função para fechar o modal
  const handleCloseResetModal = () => setShowResetModal(false);

  // Função para confirmar o reset para o estado padrão
  const handleResetClick = async () => {
    try {
      await resetToDefault();
      showToast("Dados resetados para a versão de fábrica! Recarregando a página...", "success");
      setTimeout(() => navigate(0), 3000);
    } catch (error) {
      console.error(error);
      showToast("Erro ao resetar os dados", "danger");
    }
  };

  // Função de criação do link compartilhável
  const handleShareableLink = async () => {
    try {
      const jsonString = await exportDexieToJSON();
      const encodedData = btoa(encodeURIComponent(jsonString)); // Codificando a string JSON para Base64
      const shareLink = `${window.location.origin}/import?data=${encodedData}`;

      // Verifica o comprimento do link
      if (shareLink.length > 10000) {
        showToast("O link é muito longo para ser gerado. Utilize o JSON ao invés disso", "danger");
        return;
      }

      // Encurtar a URL usando a API do TinyURL
      const tinyUrl = await shortenUrl(shareLink);

      await navigator.clipboard.writeText(tinyUrl);
      showToast("Link encurtado copiado para a área de transferência!", "success");
    } catch (error) {
      console.error(error);
      showToast("Erro ao gerar link", "danger");
    }
  };

  // Função para encurtar a URL usando TinyURL
  const shortenUrl = async (url: string) => {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error("Erro ao encurtar a URL");
    }

    const shortUrl = await response.text();
    return shortUrl;
  };

  return (
    <>
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
                <Dropdown.Item as="button" onClick={handleShowResetModal}>
                  <FontAwesomeIcon icon={faRotateLeft} className="fa-xl mx-2" />
                  <span>Resetar dados</span>
                </Dropdown.Item>
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
                <Dropdown.Item as="button" onClick={handleShareableLink}>
                  <FontAwesomeIcon icon={faLink} className="fa-xl mx-2" />
                  <span>Criar link compartilhável</span>
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
                  <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} className="fa-xl hidden-icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as="button" onClick={handleShowResetModal}>
                    <FontAwesomeIcon icon={faRotateLeft} className="fa-xl mx-2" />
                    Resetar dados
                  </Dropdown.Item>
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
                  <Dropdown.Item as="button" onClick={handleShareableLink}>
                    <FontAwesomeIcon icon={faLink} className="fa-xl mx-2" />
                    <span>Criar link compartilhável</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showResetModal} onHide={handleCloseResetModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja resetar a aplicação para os dados default? Esta ação não pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseResetModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleResetClick}>
            Resetar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarRPG;
