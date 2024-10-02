import { useNavigate } from "react-router-dom";
import TraitCreate from "../components/TraitCreate";
import { TipoCaracteristica } from "../types";

const Racas: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-raca/${id}`); // Navegar para a tela de edição
  };

  return <TraitCreate tipo={TipoCaracteristica.RACA} handleEdit={handleEdit}></TraitCreate>;
};

export default Racas;
