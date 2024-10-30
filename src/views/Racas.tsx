import TraitContainer from "../components/TraitContainer";
import { TipoCaracteristica } from "../types";

const Racas: React.FC = () => {
  return (
    <TraitContainer
      tipo={TipoCaracteristica.RACA}
      editPath={(id) => `/editar-raca/${id}`}
      title="Raças"
    />
  );
};

export default Racas;
