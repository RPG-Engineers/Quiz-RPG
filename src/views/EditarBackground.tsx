import { useParams } from "react-router-dom";
import TraitEdit from "../components/TraitEdit";
import { TipoCaracteristica } from "../types";

const EditarBackground: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <TraitEdit id={Number(id)} tipo={TipoCaracteristica.BACKGROUND} navigationDestiny="/backgrounds" ></TraitEdit>
    );
};

export default EditarBackground;
