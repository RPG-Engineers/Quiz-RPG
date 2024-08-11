import { useNavigate } from "react-router-dom";
import CaracteristicaCreator from "../components/CaracteristicaCreator";
import { TipoCaracteristica } from "../types";

const Backgrounds: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-background/${id}`); // Navegar para a tela de edição
  };

  return <CaracteristicaCreator tipo={TipoCaracteristica.BACKGROUND} handleEdit={handleEdit}></CaracteristicaCreator>;
};

export default Backgrounds;
