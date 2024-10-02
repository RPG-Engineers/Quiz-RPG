import { useParams } from "react-router-dom";
import { QuizEdit } from "../components/QuizEdit";

const EditarQuestionario: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <QuizEdit id={Number(id)} navigationDestiny="/questionarios"></QuizEdit>
    );
};

export default EditarQuestionario;
