import { useParams } from "react-router-dom";
import CaracteristicaEditor from "../components/CaracteristicaEditor";
import { TipoCaracteristica } from "../types";

const EditarClasse: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <CaracteristicaEditor id={Number(id)} tipo={TipoCaracteristica.CLASSE} navigationDestiny="/classes" ></CaracteristicaEditor>
    );
};

export default EditarClasse;
