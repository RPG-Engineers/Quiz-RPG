import { useNavigate } from "react-router-dom";
import TraitCreate from "../components/TraitCreate";
import { TipoCaracteristica } from "../types";

const Backgrounds: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-background/${id}`); // Navegar para a tela de edição
  };

  return <TraitCreate tipo={TipoCaracteristica.BACKGROUND} handleEdit={handleEdit}></TraitCreate>;
};

export default Backgrounds;
