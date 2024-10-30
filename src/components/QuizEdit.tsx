import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getPerguntas, getPerguntasByQuestionarioId } from "../database/pergunta";
import {
  getQuestionarioById,
  updateAssociationQuestionarioToPerguntas,
  updateQuestionario,
} from "../database/questionario";
import { FormErrors, Pergunta, Questionario } from "../types";
import { useToast } from "../context/ToastContext";
import { handleInputChange } from "../utils/formHelpers";
import QuestionSelection from "./QuestionSelection";

interface QuizEditProps {
  id: number;
}

export const QuizEdit: React.FC<QuizEditProps> = ({ id }) => {
  const [updatedQuiz, setUpdatedQuiz] = useState<Questionario>({
    nome: "",
    default: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: false,
  });
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
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

    // Validação do nome do questionário
    updatedQuiz.nome = updatedQuiz.nome.trim();
    if (updatedQuiz.nome === "") {
      setFormErrors({ ...formErrors, nome: true });
      showToast(`Nome do questionário não pode ser vazio!`, "danger");
      return;
    }

    // Validação do número de perguntas
    if (selectedPerguntas.size < 1) {
      showToast("O questionário deve ter pelo menos uma pergunta.", "danger");
      return;
    }

    try {
      await updateQuestionario(id, updatedQuiz);
      await updateAssociationQuestionarioToPerguntas(id, selectedPerguntas);
      showToast("Questionário atualizado com sucesso", "success");
      navigate("/questionarios");
    } catch (error) {
      showToast(`Não foi possível atualizar, erro: ${error}`, "danger");
    }
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const perguntasFromDB = await getPerguntas();
        setPerguntas(perguntasFromDB);

        const questionario = await getQuestionarioById(id);
        const perguntas = await getPerguntasByQuestionarioId(id);
        setUpdatedQuiz(questionario);
        setSelectedPerguntas(new Set(perguntas.map((pergunta) => pergunta.id_pergunta!)));
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
                    name="nome"
                    value={updatedQuiz.nome}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        updatedQuiz,
                        setUpdatedQuiz,
                        formErrors,
                        setFormErrors
                      )
                    }
                    className={formErrors.nome ? "is-invalid" : ""}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <h1 className="fs-5">Perguntas</h1>
                  <QuestionSelection
                    perguntas={perguntas}
                    selectedPerguntas={selectedPerguntas}
                    onTogglePergunta={handleCheckboxChange}
                  />
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
