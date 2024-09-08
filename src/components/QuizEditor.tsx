import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getPerguntas, getQuestionarioById, updateQuestionario } from "../database/database";
import { Pergunta, Questionario, QuestionarioWithPerguntas } from "../types";

interface QuizEditorProps {
  id: number;
  navigationDestiny: string;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ id, navigationDestiny }) => {
  const [quiz, setQuiz] = useState<Questionario>();
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [selectedPerguntas, setSelectedPerguntas] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  
  const handleCheckboxChange = (id: number) => {
    setSelectedPerguntas((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quiz_updated: QuestionarioWithPerguntas = {
      id_questionario: quiz!.id_questionario, // Adicionado o ID do questionário
      nome: quiz!.nome,
      default: quiz!.default,
      perguntas: perguntas.filter((pergunta) => selectedPerguntas.has(pergunta.id_pergunta!)),
    };
    
    await updateQuestionario(quiz_updated);

    // Redirecionar para a página especificada após salvar
    navigate(navigationDestiny);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perguntasFromDB = await getPerguntas();
        setPerguntas(perguntasFromDB);

        const questionarioWithPerguntas = await getQuestionarioById(id);
        const questionario: Questionario = {
          id_questionario: questionarioWithPerguntas.id_questionario,
          nome: questionarioWithPerguntas.nome,
          default: questionarioWithPerguntas.default,
        };
        setQuiz(questionario);
        setSelectedPerguntas(new Set(questionarioWithPerguntas.perguntas.map((pergunta) => pergunta.id_pergunta!)));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome do questionário"
                    value={quiz?.nome || ""}
                    onChange={(e) => setQuiz((prev) => prev && { ...prev, nome: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <h1 className="fs-5">Perguntas</h1>
                  {perguntas.map((pergunta, index) => (
                    <div key={index} className="d-flex align-items-center mt-2">
                      <Form.Check
                        type="checkbox"
                        id={pergunta.id_pergunta!.toString()}
                        label={pergunta.pergunta}
                        checked={selectedPerguntas.has(pergunta.id_pergunta!)}
                        onChange={() => handleCheckboxChange(pergunta.id_pergunta!)}
                      />
                    </div>
                  ))}
                </Form.Group>
                <Button variant="success" type="submit" className="mt-3">
                  Salvar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
