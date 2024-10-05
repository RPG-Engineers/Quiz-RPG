import { useEffect, useState } from "react";
import { QuizCreate } from "../components/QuizCreate";
import { getPerguntas } from "../database/pergunta";
import { Pergunta } from "../types";

const CriarQuestionario: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);

  const fetchData = async () => {
    const perguntasFromDB = await getPerguntas();
    setPerguntas(perguntasFromDB);
  };

  // Construtor do Componente
  useEffect(() => {
    fetchData();
  }, []);

  return <QuizCreate perguntas={perguntas}></QuizCreate>;
};

export default CriarQuestionario;
