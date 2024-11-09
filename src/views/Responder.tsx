import { Button, Col, Container, ProgressBar, Row } from "react-bootstrap";
import AnswerCard from "../components/AnswerCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AggregationPergunta } from "../types";
import { getPerguntasByQuestionarioId } from "../database/pergunta";
import { getAlternativasByPerguntaId } from "../database/alternativa";

export const Responder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [perguntas, setPerguntas] = useState<AggregationPergunta[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [respostas, setRespostas] = useState<Map<number, number>>(new Map());
  const navigate = useNavigate();

  const PERGUNTAS_POR_PAGINA = 2;
  const perguntasExibir = perguntas.slice(currentPage * PERGUNTAS_POR_PAGINA, (currentPage + 1) * PERGUNTAS_POR_PAGINA);

  // Função para voltar para a página anterior
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para seleciona a alternativa
  const handleAlternativeSelect = (perguntaId: number, alternativaId: number) => {
    setRespostas((prevRespostas) => {
      const newRespostas = new Map(prevRespostas);
      newRespostas.set(perguntaId, alternativaId);
      return newRespostas;
    });
  };

  // Função para alterar para a próxima página
  const handleNext = () => {
    if (currentPage < Math.ceil(perguntas.length / PERGUNTAS_POR_PAGINA) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para mostrar o resultado
  const handleResult = () => {
    navigate("/resultado", {
      state: { respostas: Array.from(respostas.entries()) }
    })
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      const perguntasFromDB = await getPerguntasByQuestionarioId(Number(id));
      const perguntasAggregation: AggregationPergunta[] = [];
      for (const pergunta of perguntasFromDB) {
        const perguntaAggregation: AggregationPergunta = {
          pergunta: pergunta,
          alternativas: await getAlternativasByPerguntaId(pergunta.id_pergunta!),
        };
        perguntasAggregation.push(perguntaAggregation);
      }
      setPerguntas(perguntasAggregation);
    };
    fetchData();
  }, [id]);

  // Construtor do Componente (Atualiza o progresso conforme a página atual muda)
  useEffect(() => {
    const totalPaginas = Math.ceil(perguntas.length / PERGUNTAS_POR_PAGINA);
    setProgress(((currentPage + 1) / totalPaginas) * 100);
  }, [currentPage, perguntas.length]);

  return (
    <Container className="h-100 mt-3">
      <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
          {perguntasExibir.map((pergunta) => (
            <AnswerCard
              key={pergunta.pergunta.id_pergunta}
              pergunta={pergunta.pergunta}
              alternativas={pergunta.alternativas}
              selectedAlternativeId={respostas.get(pergunta.pergunta.id_pergunta!)}
              onSelect={handleAlternativeSelect}
            />
          ))}
          <Button variant="primary" className="float-start mt-4" onClick={handlePrev} disabled={currentPage === 0}>
            Voltar
          </Button>
          {currentPage >= Math.ceil(perguntas.length / PERGUNTAS_POR_PAGINA) - 1 ? (
            <Button variant="primary" className="float-end mt-4" onClick={handleResult} disabled={respostas.size !== perguntas.length}>
              Ver Resultado
            </Button>
          ) : (
            <Button variant="primary" className="float-end mt-4" onClick={handleNext}>
              Próximo
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};
