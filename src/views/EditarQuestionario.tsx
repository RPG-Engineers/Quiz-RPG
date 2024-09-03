import { useParams } from "react-router-dom";
import { QuizEditor } from "../components/QuizEditor";

const EditarQuestionario: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <QuizEditor></QuizEditor>
    );
};

export default EditarQuestionario;
