import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addQuestionario, associateQuestionarioToPerguntas } from "../database/questionario";
import { Pergunta, Questionario } from "../types";

interface QuizCreateProps {
  perguntas: Pergunta[];
}

export const QuizCreate: React.FC<QuizCreateProps> = ({ perguntas }) => {
  const [quizName, setQuizName] = useState("");
  const [selectedPerguntas, setSelectedPerguntas] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Selecionar Pergunta
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

  // Salvar Questionário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quiz: Questionario = {
      nome: quizName,
      default: false,
    };

    const id = await addQuestionario(quiz);
    await associateQuestionarioToPerguntas(id, selectedPerguntas);
    navigate(`/questionarios`);
  };

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
