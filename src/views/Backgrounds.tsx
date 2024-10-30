import TraitContainer from "../components/TraitContainer";
import { TipoCaracteristica } from "../types";

const Backgrounds: React.FC = () => {
  return (
    <TraitContainer
      tipo={TipoCaracteristica.BACKGROUND}
      editPath={(id) => `/editar-background/${id}`}
      title="Backgrounds"
    />
  );
};

export default Backgrounds;
