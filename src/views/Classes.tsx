import TraitContainer from "../components/TraitContainer";
import { TipoCaracteristica } from "../types";

const Classes: React.FC = () => {
  return (
    <TraitContainer
      tipo={TipoCaracteristica.CLASSE}
      editPath={(id) => `/editar-classe/${id}`}
      title="Classes"
    />
  );
};

export default Classes;
