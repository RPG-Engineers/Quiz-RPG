import { useNavigate } from "react-router-dom";
import CaracteristicaCreator from "../components/CaracteristicaCreator";
import { TipoCaracteristica } from "../types";

const Classes: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-classe/${id}`); // Navegar para a tela de edição
  };

  return <CaracteristicaCreator tipo={TipoCaracteristica.CLASSE} handleEdit={handleEdit}></CaracteristicaCreator>;
};

export default Classes;
