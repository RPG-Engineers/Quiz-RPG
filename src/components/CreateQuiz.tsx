import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Pergunta, QuestionarioWithPerguntas } from "../types";
import { getPerguntas } from "../database/pergunta";
import { addQuestionario } from "../database/questionario";
import { useNavigate } from "react-router-dom";

export const CreateQuiz: React.FC = () => {
  const [quizName, setQuizName] = useState("");
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

    const quiz: QuestionarioWithPerguntas = {
      nome: quizName,
      default: false,
      perguntas: perguntas.filter((pergunta) => selectedPerguntas.has(pergunta.id_pergunta!)),
    };
    
    await addQuestionario(quiz);
    navigate(`/questionarios`);
  };

  const fetchPerguntas = async () => {
    const perguntasFromDB = await getPerguntas();
    setPerguntas(perguntasFromDB);
  };

  useEffect(() => {
    fetchPerguntas();
  }, []);

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
                    onChange={(e) => setQuizName(e.target.value)}
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
                        onChange={() => handleCheckboxChange(pergunta.id_pergunta!)}
                      />
                    </div>
                  ))}
                </Form.Group>
                <Button variant="success" type="submit" className="mt-3">
                  Criar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
