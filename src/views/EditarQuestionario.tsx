import { useParams } from "react-router-dom";
import { QuizEditor } from "../components/QuizEditor";

const EditarQuestionario: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <QuizEditor id={Number(id)} navigationDestiny="/questionarios"></QuizEditor>
    );
};

export default EditarQuestionario;
