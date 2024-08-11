import { useParams } from "react-router-dom";
import CaracteristicaEditor from "../components/CaracteristicaEditor";
import { TipoCaracteristica } from "../types";

const EditarBackground: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <CaracteristicaEditor id={Number(id)} tipo={TipoCaracteristica.BACKGROUND} navigationDestiny="/background" ></CaracteristicaEditor>
    );
};

export default EditarBackground;
