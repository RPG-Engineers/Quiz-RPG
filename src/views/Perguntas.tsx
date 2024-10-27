import { useEffect, useState } from "react";
import { QuestionMasterCard } from "../components/QuestionMasterCard";
import { QuestionCreate } from "../components/QuestionCreate";
import { getTags } from "../database/tag";
import { deletePergunta, getPerguntas } from "../database/pergunta";
import { Pergunta, Tag } from "../types";
import { useNavigate } from "react-router-dom";
import HintCard from "../components/HintCard";

const Perguntas: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-pergunta/${id}`);
  };

  const handleDelete = async (id: number) => {
    await deletePergunta(id);
    setPerguntas((prev) => prev.filter((pergunta) => pergunta.id_pergunta !== id));
  };

  const fetchData = async () => {
    const tagsFromDB = await getTags();
    const perguntasFromDB = await getPerguntas();
    setTags(tagsFromDB);
    setPerguntas(perguntasFromDB);
  };

  // Construtor do Componente
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HintCard>
        Você pode descrever uma situação do tipo "O que você faria?" e de acordo como o jogador se
        comportaria diante dela, qualificaria a alternativa escolhida com as tags adequadas.
      </HintCard>
      <QuestionCreate tags={tags} fetchData={fetchData} />
      {perguntas.map((pergunta) => (
        <QuestionMasterCard
          key={pergunta.id_pergunta}
          pergunta={pergunta}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default Perguntas;
