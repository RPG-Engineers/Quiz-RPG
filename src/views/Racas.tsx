import { useNavigate } from "react-router-dom";
import CaracteristicaCreator from "../components/CaracteristicaCreator";
import { TipoCaracteristica } from "../types";

const Racas: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-raca/${id}`); // Navegar para a tela de edição
  };

  return <CaracteristicaCreator tipo={TipoCaracteristica.RACA} handleEdit={handleEdit}></CaracteristicaCreator>;
};

export default Racas;
