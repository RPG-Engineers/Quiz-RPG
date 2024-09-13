import { Button, Col, Container, ProgressBar, Row } from "react-bootstrap";
import QuestionCard from "../components/QuestionCard";
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

  // Atualiza o progresso conforme a página atual muda
  useEffect(() => {
    const totalPaginas = Math.ceil(perguntas.length / PERGUNTAS_POR_PAGINA);
    setProgress(((currentPage + 1) / totalPaginas) * 100);
  }, [currentPage, perguntas.length]);

  // Função para alterar para a próxima página
  const handleNext = () => {
    if (currentPage < Math.ceil(perguntas.length / PERGUNTAS_POR_PAGINA) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAlternativeSelect = (perguntaId: number, alternativaId: number) => {
    setRespostas((prevRespostas) => {
      const newRespostas = new Map(prevRespostas);
      newRespostas.set(perguntaId, alternativaId);
      return newRespostas;
    });
  };

  const handleResult = () => {
    navigate("/resultado", {
      state: { respostas: Array.from(respostas.entries()) }
    })
  };

  const perguntasExibir = perguntas.slice(currentPage * PERGUNTAS_POR_PAGINA, (currentPage + 1) * PERGUNTAS_POR_PAGINA);

  return (
    <Container className="h-100 mt-3">
      <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          {perguntasExibir.map((pergunta) => (
            <QuestionCard
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
