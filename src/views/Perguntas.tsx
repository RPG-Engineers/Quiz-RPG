import { CardPergunta } from "../components/CardPergunta";
import { CreatePergunta } from "../components/CreatePergunta";

const Perguntas: React.FC = () => {
  return (
    <>
      <CreatePergunta></CreatePergunta>
      <CardPergunta pergunta="Sua Pergunta?"></CardPergunta>
    </>
  );
};

export default Perguntas;
