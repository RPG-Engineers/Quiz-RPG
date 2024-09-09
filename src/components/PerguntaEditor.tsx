import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Accordion } from "react-bootstrap";
import { CreateAlternativa, CreateAlternativaProps } from "./CreateAlternativa";
import { v4 as uuidv4 } from "uuid";
import { getAlternativasByPerguntaId } from "../database/alternativa";
import { getPerguntaById, updateAssociationPerguntaToAlternativas, updatePergunta } from "../database/pergunta";
import { AlternativaWithTags, Pergunta, Tag } from "../types";
import { useNavigate } from "react-router-dom";

interface PerguntaEditorProps {
  id: number;
  tags: Tag[];
  navigationDestiny: string;
}

export const PerguntaEditor: React.FC<PerguntaEditorProps> = ({ id, tags, navigationDestiny }) => {
  const [alternativaProps, setAlternativaProps] = useState<CreateAlternativaProps[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [alternativaTexts, setAlternativaTexts] = useState<{ [key: string]: string }>({});
  const [alternativaTags, setAlternativaTags] = useState<{ [key: string]: Set<number> }>({});
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchPerguntaData = async () => {
      const pergunta = await getPerguntaById(id);
      setQuestionText(pergunta.pergunta);
      const alternativasWithTags = await getAlternativasByPerguntaId(id);
      const alternativasTexts: { [key: string]: string } = {};
      const alternativasTags: { [key: string]: Set<number> } = {};
      const alternativasProps: CreateAlternativaProps[] = [];

      for (const alternativa of alternativasWithTags) {
        if (alternativa.id_alternativa) {
          alternativasTexts[alternativa.id_alternativa.toString()] = alternativa.alternativa;
          alternativasTags[alternativa.id_alternativa.toString()] = alternativa.tagsIds;

          alternativasProps.push({
            id: alternativa.id_alternativa.toString(),
            placeholder: `Opção ${alternativasProps.length + 1}`,
            eventKey: alternativa.id_alternativa.toString(),
            tags: tags,
            onRemove: () => handleRemoveOption(alternativa.id_alternativa!.toString()),
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

    fetchPerguntaData();
  }, [id, handleAlternativaTagChange, tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPegunta: Pergunta = {
      pergunta: questionText
    }

    const alternativas: AlternativaWithTags[] = alternativaProps.map((alt) => {
      const id_alternativa = isNaN(Number(alt.id)) ? undefined : Number(alt.id);
      return {
        id_alternativa,
        id_pergunta: id,
        alternativa: alternativaTexts[alt.id],
        tagsIds: alternativaTags[alt.id],
      };
    });
    

    await updatePergunta(id, updatedPegunta);
    await updateAssociationPerguntaToAlternativas(id, alternativas);
    navigate(navigationDestiny);
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
                        initialText={alternativaTexts[alternativa.id]}
                        initialTags={alternativaTags[alternativa.id]}
                      />
                    ))}
                  </Accordion>
                  <Button variant="light" className="mt-3" id="addOptionButton" onClick={handleAddOption}>
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
    </Container>
  );
};
