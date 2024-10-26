import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavbarRPG from "./components/Navbar";
import Home from "./views/Home";
import Caracteristicas from "./views/Caracteristicas";
import Classes from "./views/Classes";
import Racas from "./views/Racas";
import Backgrounds from "./views/Backgrounds";
import Tags from "./views/Tags";
import EditarTag from "./views/EditarTag";
import Perguntas from "./views/Perguntas";
import Questionarios from "./views/Questionarios";
import EditarBackground from "./views/EditarBackground";
import EditarClasse from "./views/EditarClasse";
import EditarRaca from "./views/EditarRaca";
import { useEffect, useMemo, useState } from "react";
import { importDefaultData } from "./database/db";
import { Responder } from "./views/Responder";
import EditarPergunta from "./views/EditarPergunta";
import EditarQuestionario from "./views/EditarQuestionario";
import { Resultado } from "./views/Resultado";
import CriarQuestionario from "./views/CriarQuestionario";
import { Modal, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useToast } from "./context/ToastContext";
import remarkGfm from "remark-gfm";
import EmojiConvertor from 'emoji-js';


function App() {
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [patchNotes, setPatchNotes] = useState("");
  const { showToast } = useToast();

  // Inicializa a conversão de emoji
  const emoji = useMemo(() => {
    const e = new EmojiConvertor();
    e.replace_mode = 'unified';
    return e;
  }, []);

  useEffect(() => {
    const fetchPatchNotes = async () => {
      const lastSeenVersion = localStorage.getItem("lastSeenVersion");
  
      try {
        const response = await fetch("/Quiz-RPG/patch-notes.json");
        
        if (!response.ok) {
          throw new Error("Não foi possível consultar as notas de atualização");
        }
  
        const data = await response.json();
        const currentVersion = data.version;
  
        if (currentVersion && currentVersion !== lastSeenVersion) {
          setPatchNotes(emoji.replace_colons(data.notes));
          setShowPatchNotes(true);
        }
      } catch (error) {
        showToast(`${error}`, 'danger');
      }
    };
    fetchPatchNotes();

    const importData = async () => {
      try {
        await importDefaultData();
      } catch (error) {
        showToast(`${error}`, 'danger');
      }
    };
    importData();
  }, [emoji, showToast]);
  

  const handlePatchNotesClose = () => {
    setShowPatchNotes(false);
    fetch("/Quiz-RPG/patch-notes.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Não foi possível consultar as notas de atualização");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("lastSeenVersion", data.version);
        setPatchNotes(emoji.replace_colons(data.notes));
      })
      .catch((error) => showToast(`${error}`, 'danger'));
  };
  
  return (
    <>
      <Router basename="/Quiz-RPG">
        <NavbarRPG />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/caracteristicas" element={<Caracteristicas />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/racas" element={<Racas />} />
          <Route path="/backgrounds" element={<Backgrounds />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/perguntas" element={<Perguntas />} />
          <Route path="/questionarios" element={<Questionarios />} />
          <Route path="/responder/:id" element={<Responder />} />
          <Route path="/editar-tag/:id" element={<EditarTag />} />
          <Route path="/editar-background/:id" element={<EditarBackground />} />
          <Route path="/editar-classe/:id" element={<EditarClasse />} />
          <Route path="/editar-raca/:id" element={<EditarRaca />} />
          <Route path="/editar-pergunta/:id" element={<EditarPergunta />} />
          <Route path="/editar-questionario/:id" element={<EditarQuestionario />} />
          <Route path="/criar-questionario" element={<CriarQuestionario />} />
          <Route path="/resultado" element={<Resultado />} />
        </Routes>
      </Router>

      {/* Modal de Patch Notes */}
      <Modal show={showPatchNotes} onHide={handlePatchNotesClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Novidades da versão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactMarkdown children={patchNotes} remarkPlugins={[remarkGfm]} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePatchNotesClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
