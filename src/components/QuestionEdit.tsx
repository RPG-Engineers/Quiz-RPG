import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Accordion, Modal } from "react-bootstrap";
import { AlternativeCreate, AlternativeCreateProps } from "./AlternativeCreate";
import { v4 as uuidv4 } from "uuid";
import { getAlternativasByPerguntaId } from "../database/alternativa";
import { getPerguntaById, updateAssociationPerguntaToAlternativas, updatePergunta } from "../database/pergunta";
import { AlternativaWithTags, FormErrors, Pergunta, Tag } from "../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { handleInputChange } from "../utils/formHelpers";

interface QuestionEditProps {
  id: number;
  tags: Tag[];
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({ id, tags }) => {
  const [alternativaProps, setAlternativaProps] = useState<AlternativeCreateProps[]>([]);
  const [updatedQuestion, setUpdatedQuestion] = useState<Pergunta>({ pergunta: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({ pergunta: false });
  const [alternativaTexts, setAlternativaTexts] = useState<{ [key: string]: string }>({});
  const [alternativaTags, setAlternativaTags] = useState<{ [key: string]: Set<number> }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
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
        onTextChange: handleAlternativaTextChange,
        onTagChange: handleAlternativaTagChange,
      },
    ]);
  };

  const handleAlternativaTextChange = (id: string, text: string) => {
    setAlternativaTexts((prev) => ({ ...prev, [id]: text }));
  };

  const handleAlternativaTagChange = useCallback((id: string, selectedTags: Set<number>) => {
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

  // Função para salvar a pergunta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificação se a pergunta está vazia
    updatedQuestion.pergunta = updatedQuestion.pergunta.trim();
    if (updatedQuestion.pergunta === "") {
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

    submitQuestion();
  };

  // Função para submeter a pergunta e as alternativas
  const submitQuestion = async () => {
    const alternativas: AlternativaWithTags[] = alternativaProps.map((alt) => {
      const id_alternativa = isNaN(Number(alt.id)) ? undefined : Number(alt.id);
      return {
        id_alternativa,
        id_pergunta: id,
        alternativa: alternativaTexts[alt.id],
        tagsIds: alternativaTags[alt.id],
      };
    });

    await updatePergunta(id, updatedQuestion);
    await updateAssociationPerguntaToAlternativas(id, alternativas);
    navigate("/perguntas");
    setShowConfirmation(false);
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      const pergunta = await getPerguntaById(id);
      setUpdatedQuestion(pergunta);
      const alternativasWithTags = await getAlternativasByPerguntaId(id);
      const alternativasTexts: { [key: string]: string } = {};
      const alternativasTags: { [key: string]: Set<number> } = {};
      const alternativasProps: AlternativeCreateProps[] = [];

      for (const alternativa of alternativasWithTags) {
        if (alternativa.id_alternativa) {
          alternativasTexts[alternativa.id_alternativa.toString()] = alternativa.alternativa;
          alternativasTags[alternativa.id_alternativa.toString()] = alternativa.tagsIds;

          alternativasProps.push({
            id: alternativa.id_alternativa.toString(),
            placeholder: `Opção ${alternativasProps.length + 1}`,
            eventKey: alternativa.id_alternativa.toString(),
            tags: tags,
            onRemove: () => handleRemoveAlternative(alternativa.id_alternativa!.toString()),
            onTextChange: handleAlternativaTextChange,
            onTagChange: handleAlternativaTagChange,
            initialText: alternativa.alternativa,
            initialTags: alternativa.tagsIds,
          });
        }
      }

      setAlternativaTexts(alternativasTexts);
      setAlternativaProps(alternativasProps);
      setAlternativaTags(alternativasTags);
    };

    fetchData();
  }, [id, handleAlternativaTagChange, tags]);

  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title>Sua Pergunta</Card.Title>
              <Form id="questionForm" onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Escreva a pergunta aqui..."
                    name="pergunta"
                    value={updatedQuestion.pergunta}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        updatedQuestion,
                        setUpdatedQuestion,
                        formErrors,
                        setFormErrors
                      )
                    }
                    className={formErrors.pergunta ? "is-invalid" : ""}
                  />
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
                        onTextChange={handleAlternativaTextChange}
                        onTagChange={handleAlternativaTagChange}
                        initialText={alternativaTexts[alternativa.id]}
                        initialTags={alternativaTags[alternativa.id]}
                      />
                    ))}
                  </Accordion>
                  <Button variant="light" className="mt-3" onClick={handleAddAlternative}>
                    Adicionar opção
                  </Button>
                </Form.Group>
                <Button variant="success" type="submit" className="mt-3">
                  Salvar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alternativas sem Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>Algumas alternativas estão sem tags associadas. Deseja continuar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={submitQuestion}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
