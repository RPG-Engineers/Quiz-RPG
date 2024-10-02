import { useParams } from "react-router-dom";
import TraitEdit from "../components/TraitEdit";
import { TipoCaracteristica } from "../types";

const EditarClasse: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <TraitEdit id={Number(id)} tipo={TipoCaracteristica.CLASSE} navigationDestiny="/classes" ></TraitEdit>
    );
};

export default EditarClasse;
