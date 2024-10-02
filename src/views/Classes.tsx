import { useNavigate } from "react-router-dom";
import TraitCreate from "../components/TraitCreate";
import { TipoCaracteristica } from "../types";

const Classes: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-classe/${id}`); // Navegar para a tela de edição
  };

  return <TraitCreate tipo={TipoCaracteristica.CLASSE} handleEdit={handleEdit}></TraitCreate>;
};

export default Classes;
