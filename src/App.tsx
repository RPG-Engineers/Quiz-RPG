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

function App() {
  useEffect(() => {
    importDefaultData().catch(err => console.error(err));
  }, []);
  return (
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
        <Route path="/editar-tag/:id" element={<EditarTag />} />
        <Route path="/editar-background/:id" element={<EditarBackground />} />
        <Route path="/editar-classe/:id" element={<EditarClasse />} />
        <Route path="/editar-raca/:id" element={<EditarRaca />} />
        <Route path="/perguntas" element={<Perguntas />} />
        <Route path="/questionarios" element={<Questionarios />} />
      </Routes>
    </Router>
  );
}

export default App;
