import { useParams } from "react-router-dom";
import TraitEdit from "../components/TraitEdit";
import { TipoCaracteristica } from "../types";

const EditarRaca: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <TraitEdit id={Number(id)} tipo={TipoCaracteristica.RACA} navigationDestiny="/racas" ></TraitEdit>
    );
};

export default EditarRaca;
