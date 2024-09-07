import { useParams } from "react-router-dom";
import { PerguntaEditor } from "../components/PerguntaEditor";
import { getTags } from "../database/database";
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
        <PerguntaEditor id={Number(id)} tags={tags} navigationDestiny="/perguntas"></PerguntaEditor>
    );
};

export default EditarPergunta;
