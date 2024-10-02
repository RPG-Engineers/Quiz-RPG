import { useParams } from "react-router-dom";
import { QuestionEdit } from "../components/QuestionEdit";
import { getTags } from "../database/tag";
import { Tag } from "../types";
import { useEffect, useState } from "react";

const EditarPergunta: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          const tagsFromDB = await getTags();
          setTags(tagsFromDB);
        };
        fetchData();
      }, []);

    return (
        <QuestionEdit id={Number(id)} tags={tags} navigationDestiny="/perguntas"></QuestionEdit>
    );
};

export default EditarPergunta;
