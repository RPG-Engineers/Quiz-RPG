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
import { useEffect } from "react";
import { importDefaultData } from "./database/db";
import { Responder } from "./views/Responder";
import EditarPergunta from "./views/EditarPergunta";
import EditarQuestionario from "./views/EditarQuestionario";
import { Resultado } from "./views/Resultado";
import CriarQuestionario from "./views/CriarQuestionario";
import { ToastProvider } from "./context/ToastContext";

function App() {
  useEffect(() => {
    importDefaultData().catch((err) => console.error(err));
  }, []);

  return (
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
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
