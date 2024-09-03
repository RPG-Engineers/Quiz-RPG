import { useParams } from "react-router-dom";
import { PerguntaEditor } from "../components/PerguntaEditor";

const EditarPergunta: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <PerguntaEditor></PerguntaEditor>
    );
};

export default EditarPergunta;
