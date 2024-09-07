import { useEffect, useState } from "react";
import { CardPergunta } from "../components/CardPergunta";
import { CreatePergunta } from "../components/CreatePergunta";
import { getPerguntas, getTags } from "../database/database";
import { Pergunta, Tag } from "../types";
import { useNavigate } from "react-router-dom";

const Perguntas: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-pergunta/${id}`);
  };

  const fetchData = async () => {
    const tagsFromDB = await getTags();
    const perguntasFromDB = await getPerguntas();
    setTags(tagsFromDB);
    setPerguntas(perguntasFromDB);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CreatePergunta tags={tags} fetchData={fetchData} />
      {perguntas.map((pergunta) => (
        <CardPergunta key={pergunta.id_pergunta} pergunta={pergunta} handleEdit={handleEdit} />
      ))}
    </>
  );
};

export default Perguntas;
