import EmojiConvertor from "emoji-js";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";
import NavbarRPG from "./components/Navbar";
import ToastNotification from "./components/ToastNotification";
import { ToastProvider } from "./context/ToastContext";
import { importDefaultData } from "./database/db";
import { ToastType, ToastVariant } from "./types";
import Backgrounds from "./views/Backgrounds";
import Caracteristicas from "./views/Caracteristicas";
import Classes from "./views/Classes";
import CriarQuestionario from "./views/CriarQuestionario";
import EditarBackground from "./views/EditarBackground";
import EditarClasse from "./views/EditarClasse";
import EditarPergunta from "./views/EditarPergunta";
import EditarQuestionario from "./views/EditarQuestionario";
import EditarRaca from "./views/EditarRaca";
import EditarTag from "./views/EditarTag";
import Home from "./views/Home";
import Perguntas from "./views/Perguntas";
import Questionarios from "./views/Questionarios";
import Racas from "./views/Racas";
import { Responder } from "./views/Responder";
import { Resultado } from "./views/Resultado";
import Tags from "./views/Tags";
import Import from "./views/Import";

interface PatchNote {
  version: string;
  date: string;
  notes: string;
}

function App() {
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [patchNotes, setPatchNotes] = useState<PatchNote[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(!localStorage.getItem("dontShowWarningAgain"));
  const [dontShowAgain, setDontShowAgain] = useState(false); // Estado para a opção "Não mostrar novamente"
  const [toasts, setToasts] = useState<Array<ToastType>>([]);

  // Inicializa a conversão de emoji
  const emoji = useMemo(() => {
    const e = new EmojiConvertor();
    e.replace_mode = "unified";
    return e;
  }, []);

  const showToast = (message: string, variant: ToastVariant) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const fetchPatchNotes = async () => {
      const lastSeenVersion = localStorage.getItem("lastSeenVersion");

      try {
        const response = await fetch("patch-notes.json");

        if (!response.ok) {
          throw new Error("Não foi possível consultar as notas de atualização");
        }

        const data = await response.json();
        const currentVersion = data.currentVersion;
        const notesHistory: PatchNote[] = data.versions.map((note: PatchNote) => ({
          version: note.version,
          date: note.date,
          notes: emoji.replace_colons(note.notes),
        }));

        if (currentVersion && currentVersion !== lastSeenVersion) {
          setPatchNotes(notesHistory);
          setShowPatchNotes(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message, "danger");
        } else {
          console.error(error);
          showToast("Ocorreu um erro desconhecido", "danger");
        }
      }
    };

    const importData = async () => {
      try {
        const status = await importDefaultData();
        switch (status) {
          case 0:
            showToast("O banco de dados já contém dados. Os dados padrão não foram importados.", "warning");
            break;
          case 1:
            showToast("Dados padrão importados com sucesso!", "success");
            break;
        }
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message, "danger");
        } else {
          console.error(error);
          showToast("Ocorreu um erro desconhecido", "danger");
        }
      }
    };

    fetchPatchNotes();
    importData();
  }, [emoji]);

  const handlePatchNotesClose = () => {
    setShowPatchNotes(false);
    fetch("patch-notes.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Não foi possível consultar as notas de atualização");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("lastSeenVersion", data.currentVersion);
      })
      .catch((error) => {
        if (error instanceof Error) {
          showToast(error.message, "danger");
        } else {
          console.error(error);
          showToast("Ocorreu um erro desconhecido", "danger");
        }
      });
  };

  const handleWarningModalClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowWarningAgain", "true");
    }
    setShowWarningModal(false);
  };

  return (
    <>
      <ToastProvider>
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
            <Route path="/import" element={<Import />} />
          </Routes>
        </Router>

        {/* Modal de Patch Notes */}
        <Modal show={showPatchNotes} onHide={handlePatchNotesClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Novidades da versão</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {patchNotes.map((note: PatchNote, index: number) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <ReactMarkdown children={note.notes} remarkPlugins={[remarkGfm]} />
                <hr />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handlePatchNotesClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Aviso de Dados Locais */}
        <Modal show={showWarningModal} onHide={handleWarningModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Aviso Importante</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Os dados salvos no programa são armazenados localmente no seu navegador. Caso você limpe o cache ou exclua
            os cookies, esses dados poderão ser perdidos. Para evitar perda de informações, recomendamos que você
            exporte seus dados regularmente e os salve em um local seguro.
            <Form.Check
              type="checkbox"
              label="Não mostrar novamente"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="mt-3"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleWarningModalClose}>
              Entendi
            </Button>
          </Modal.Footer>
        </Modal>
      </ToastProvider>
      <ToastNotification toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
