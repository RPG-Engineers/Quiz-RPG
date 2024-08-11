import { useParams } from "react-router-dom";
import CaracteristicaEditor from "../components/CaracteristicaEditor";
import { TipoCaracteristica } from "../types";

const EditarRaca: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <CaracteristicaEditor id={Number(id)} tipo={TipoCaracteristica.RACA} navigationDestiny="/racas" ></CaracteristicaEditor>
    );
};

export default EditarRaca;
