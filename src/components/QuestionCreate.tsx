import React, { useCallback, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Accordion, Modal } from "react-bootstrap";
import { AlternativeCreate, AlternativeCreateProps } from "./AlternativeCreate";
import { Alternativa, FormErrors, Pergunta, Tag } from "../types";
import { addAlternativa, associateAlternativaToTags } from "../database/alternativa";
import { addPergunta } from "../database/pergunta";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../context/ToastContext";
import { handleInputChange } from "../utils/formHelpers";

interface QuestionCreateProps {
  tags: Tag[];
  fetchData: () => Promise<void>;
}

export const QuestionCreate: React.FC<QuestionCreateProps> = ({ tags, fetchData }) => {
  const [alternativaProps, setAlternativaProps] = useState<AlternativeCreateProps[]>([
    {
      id: uuidv4(),
      placeholder: "Opção 1",
      eventKey: "0",
      tags: [],
      onRemove: () => {},
      onTextChange: () => {},
      onTagChange: () => {},
    },
  ]);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    pergunta: false,
  });
  const [newQuestion, setNewQuestion] = useState<Pergunta>({
    pergunta: "",
  });
  const [alternativaTexts, setAlternativaTexts] = useState<{ [key: string]: string }>({});
  const [alternativaTags, setAlternativaTags] = useState<{ [key: string]: Set<number> }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showToast } = useToast();

  // Funções de Manipulação de Alternativas
  const handleAddAlternative = () => {
    const newAlternativeId = uuidv4();
    setAlternativaProps((prev) => [
      ...prev,
      {
        id: newAlternativeId,
        placeholder: `Opção ${prev.length + 1}`,
        eventKey: newAlternativeId,
        tags: [],
        onRemove: () => handleRemoveAlternative(newAlternativeId),
        onTextChange: handleAlternativeTextChange,
        onTagChange: handleAlternativeTagChange,
      },
    ]);
  };

  const handleAlternativeTextChange = (id: string, text: string) => {
    setAlternativaTexts((prev) => ({ ...prev, [id]: text }));
  };

  const handleAlternativeTagChange = useCallback((id: string, selectedTags: Set<number>) => {
    setAlternativaTags((prev) => ({ ...prev, [id]: selectedTags }));
  }, []);

  const handleRemoveAlternative = (idToRemove: string) => {
    setAlternativaProps((prev) =>
      prev
        .filter((alt) => alt.id !== idToRemove)
        .map((alt, index) => ({ ...alt, placeholder: `Opção ${index + 1}`, eventKey: alt.id }))
    );

    setAlternativaTexts((prev) => {
      const { [idToRemove]: _, ...rest } = prev;
      return rest;
    });

    setAlternativaTags((prev) => {
      const { [idToRemove]: _, ...rest } = prev;
      return rest;
    });
  };

  // Salvar pergunta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    newQuestion.pergunta = newQuestion.pergunta.trim();

    // Verificação se a pergunta está vazia
    if (newQuestion.pergunta === "") {
      setFormErrors({ ...formErrors, pergunta: true });
      showToast("A pergunta não pode ser vazia!", "danger");
      return;
    }

    // Verificação se há pelo menos duas alternativas com texto
    const filledAlternatives = alternativaProps.filter((alt) => alternativaTexts[alt.id]?.trim() ?? "" !== "");
    if (filledAlternatives.length < 2) {
      showToast("A pergunta deve ter pelo menos duas alternativas com texto.", "danger");
      return;
    }

    // Verificação se existem alternativas sem tags
    const hasTaglessAlternatives = filledAlternatives.some((alt) => alternativaTags[alt.id]?.size === 0);
    if (hasTaglessAlternatives) {
      setShowConfirmation(true);
      return;
    }

    await submitQuestion();
  };

  const submitQuestion = async () => {
    try {
      const id = await addPergunta(newQuestion);
      const validAlternatives = alternativaProps.filter((alt) => alternativaTexts[alt.id]?.trim() ?? "" !== "");
      for (const alternativa of validAlternatives) {
        const alternativaSave: Alternativa = {
          id_pergunta: id,
          alternativa: alternativaTexts[alternativa.id],
        };
        const id_alternativa = await addAlternativa(alternativaSave);
        await associateAlternativaToTags(id_alternativa, alternativaTags[alternativa.id]);
      }
      setShowConfirmation(false);

      // Limpeza do formulário após o sucesso
      setNewQuestion({ pergunta: "" });
      setAlternativaProps([
        {
          id: uuidv4(),
          placeholder: "Opção 1",
          eventKey: "0",
          tags: [],
          onRemove: () => {},
          onTextChange: handleAlternativeTextChange,
          onTagChange: handleAlternativeTagChange,
        },
      ]);
      setAlternativaTexts({});
      setAlternativaTags({});
      showToast("Pergunta adicionada com sucesso!", "success");
      fetchData();
    } catch (error) {
      showToast(`Não foi possível adicionar, erro: ${error}`, "danger");
    }
  };

  // Manipulação do Modal
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title>Sua Pergunta</Card.Title>
              <Form id="questionForm" onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Group controlId="questionInput">
                    <Form.Control
                      type="text"
                      placeholder="Escreva a pergunta aqui..."
                      name="pergunta"
                      value={newQuestion.pergunta}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          newQuestion,
                          setNewQuestion,
                          formErrors,
                          setFormErrors
                        )
                      }
                      className={formErrors.pergunta ? "is-invalid" : ""}
                    />
                  </Form.Group>
                  <Card.Title className="mt-3">Alternativas</Card.Title>
                  <Accordion className="d-flex flex-column gap-2">
                    {alternativaProps.map((alternativa) => (
                      <AlternativeCreate
                        key={alternativa.id}
                        id={alternativa.id}
                        placeholder={alternativa.placeholder}
                        eventKey={alternativa.eventKey}
                        onRemove={() => handleRemoveAlternative(alternativa.id)}
                        tags={tags}
                        onTextChange={handleAlternativeTextChange}
                        onTagChange={handleAlternativeTagChange}
                      />
                    ))}
                  </Accordion>
                  <Button variant="light" className="mt-3" id="addAlternativeButton" onClick={handleAddAlternative}>
                    Adicionar opção
                  </Button>
                </Form.Group>
                <Button variant="success" type="submit" className="mt-3">
                  Criar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmação */}
      <Modal show={showConfirmation} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Alternativas sem Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Algumas alternativas estão sem tags associadas. Deseja continuar?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="success" onClick={submitQuestion}>
            Criar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
