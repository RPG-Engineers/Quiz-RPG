import React, { useCallback, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Accordion } from "react-bootstrap";
import { CreateAlternativa, CreateAlternativaProps } from "./CreateAlternativa";
import { Alternativa, Pergunta, Tag } from "../types";
import { addAlternativa, associateAlternativaToTags } from "../database/alternativa";
import { addPergunta } from "../database/pergunta";
import { v4 as uuidv4 } from "uuid";

interface CreatePerguntaProps {
  tags: Tag[]
  fetchData: () => Promise<void>
}

export const CreatePergunta: React.FC<CreatePerguntaProps> = ({ tags, fetchData }) => {
  const [alternativaProps, setAlternativaProps] = useState<CreateAlternativaProps[]>([
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
  const [questionText, setQuestionText] = useState("");
  const [alternativaTexts, setAlternativaTexts] = useState<{ [key: string]: string }>({});
  const [alternativaTags, setAlternativaTags] = useState<{ [key: string]: Set<number> }>({});

  const handleAddOption = () => {
    const newOptionId = uuidv4();
    setAlternativaProps((prev) => [
      ...prev,
      {
        id: newOptionId,
        placeholder: `Opção ${prev.length + 1}`,
        eventKey: newOptionId,
        tags: [],
        onRemove: () => handleRemoveOption(newOptionId),
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

  const handleRemoveOption = (idToRemove: string) => {
    setAlternativaProps((prev) =>
      prev
        .filter((alt) => alt.id !== idToRemove)
        .map((alt, index) => ({ ...alt, placeholder: `Opção ${index + 1}`, eventKey: alt.id }))
    );

    setAlternativaTexts((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [idToRemove]: _, ...rest } = prev;
      return rest;
    });

    setAlternativaTags((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [idToRemove]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novaPergunta: Pergunta = {
      pergunta: questionText,
    };

    const id = await addPergunta(novaPergunta);

    for (const alternativa of alternativaProps) {
      const alternativaSave: Alternativa = {
        id_pergunta: id,
        alternativa: alternativaTexts[alternativa.id],
      };

      const id_alternativa = await addAlternativa(alternativaSave);
      await associateAlternativaToTags(id_alternativa, alternativaTags[alternativa.id]);
    }

    // Limpar os campos após adicionar uma nova pergunta
    setQuestionText("");
    setAlternativaProps([
      {
        id: uuidv4(),
        placeholder: "Opção 1",
        eventKey: "0",
        tags: [],
        onRemove: () => {},
        onTextChange: handleAlternativaTextChange,
        onTagChange: handleAlternativaTagChange,
      },
    ]);
    setAlternativaTexts({});
    setAlternativaTags({});
    fetchData();
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
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                  </Form.Group>
                  <Card.Title className="mt-3">Alternativas</Card.Title>
                  <Accordion className="d-flex flex-column gap-2">
                    {alternativaProps.map((alternativa) => (
                      <CreateAlternativa
                        key={alternativa.id}
                        id={alternativa.id}
                        placeholder={alternativa.placeholder}
                        eventKey={alternativa.eventKey}
                        onRemove={() => handleRemoveOption(alternativa.id)}
                        tags={tags}
                        onTextChange={handleAlternativaTextChange}
                        onTagChange={handleAlternativaTagChange}
                      />
                    ))}
                  </Accordion>
                  <Button variant="light" className="mt-3" id="addOptionButton" onClick={handleAddOption}>
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
    </Container>
  );
};
