import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addQuestionario, associateQuestionarioToPerguntas } from "../database/questionario";
import { FormErrors, Pergunta, Questionario } from "../types";
import { useToast } from "../context/ToastContext";
import { handleInputChange } from "../utils/formHelpers";

interface QuizCreateProps {
  perguntas: Pergunta[];
}

export const QuizCreate: React.FC<QuizCreateProps> = ({ perguntas }) => {
  const [newQuiz, setNewQuiz] = useState<Questionario>({
    nome: "",
    default: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: false,
  });
  const [selectedPerguntas, setSelectedPerguntas] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { showToast } = useToast();

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
    newQuiz.nome = newQuiz.nome.trim();
    if (newQuiz.nome === "") {
      setFormErrors({ ...formErrors, nome: true });
      showToast(`Nome do questionário não pode ser vazio!`, "danger");
    } else {
      try {
        const id = await addQuestionario(newQuiz);
        await associateQuestionarioToPerguntas(id, selectedPerguntas);
        showToast(
          "Questionário criado com sucesso",
          "success"
        );
        navigate(`/questionarios`);
      } catch (error) {
        showToast(`Não foi possível criar, erro: ${error}`, "danger");
      }
    }
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
                    name="nome"
                    value={newQuiz.nome}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        newQuiz,
                        setNewQuiz,
                        formErrors,
                        setFormErrors
                      )
                    }
                    className={formErrors.nome ? "is-invalid" : ""}
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
