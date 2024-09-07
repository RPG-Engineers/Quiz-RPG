import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Accordion } from "react-bootstrap";
import { CreateAlternativa, CreateAlternativaProps } from "./CreateAlternativa";
import { Tag } from "../types";
import { getTags } from "../database/database";
import { v4 as uuidv4 } from 'uuid';

export const CreatePergunta: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [alternativas, setAlternativas] = useState<CreateAlternativaProps[]>([
    { id: uuidv4(), placeholder: "Opção 1", eventKey: "0", tags: [], onRemove: () => {} },
  ]);

  const handleAddOption = () => {
    const newOption: CreateAlternativaProps = {
      id: uuidv4(),
      placeholder: `Opção ${alternativas.length + 1}`,
      eventKey: uuidv4(),
      tags: [],
      onRemove: () => {},
    };
    setAlternativas([...alternativas, newOption]);
  };

  const fetchTags = async () => {
    const tagsFromDB = await getTags();
    setTags(tagsFromDB);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleRemoveOption = (idToRemove: string) => {
    const newAlternativas = alternativas
      .filter(alternativa => alternativa.id !== idToRemove)
      .map((alternativa, index) => ({
        ...alternativa,
        placeholder: `Opção ${index + 1}`,
        eventKey: index.toString(),
      }));
    setAlternativas(newAlternativas);
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title>Sua Pergunta</Card.Title>
              <Form id="questionForm">
                <Form.Group controlId="questionInput">
                  <Form.Control type="text" placeholder="Escreva a pergunta aqui..." />
                </Form.Group>
                <Card.Title className="mt-3">Alternativas</Card.Title>
                <Accordion className="d-flex flex-column gap-2">
                  {alternativas.map((alternativa) => (
                    <CreateAlternativa
                      key={alternativa.id}
                      id={alternativa.id}
                      placeholder={alternativa.placeholder}
                      eventKey={alternativa.eventKey}
                      onRemove={() => handleRemoveOption(alternativa.id)}
                      tags={tags}
                    />
                  ))}
                </Accordion>
                <Button variant="light" className="mt-3" id="addOptionButton" onClick={handleAddOption}>
                  Adicionar opção
                </Button>
              </Form>
              <Button variant="success" type="submit" className="mt-3">
                Criar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
