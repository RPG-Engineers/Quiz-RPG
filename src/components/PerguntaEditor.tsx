import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Accordion } from "react-bootstrap";
import { CreateAlternativa, CreateAlternativaProps } from "./CreateAlternativa";

export const PerguntaEditor: React.FC = () => {
  const [alternativas, setAlternativas] = useState<CreateAlternativaProps[]>([
    { placeholder: "Opção 1", eventKey: "0" },
  ]);

  const handleAddOption = () => {
    const newKey = alternativas.length.toString();
    const newOption = {
      placeholder: `Opção ${alternativas.length + 1}`,
      eventKey: newKey,
    };
    setAlternativas([...alternativas, newOption]);
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
                  {alternativas.map((alternativa, index) => (
                    <CreateAlternativa
                      key={index}
                      placeholder={alternativa.placeholder}
                      eventKey={alternativa.eventKey}
                    />
                  ))}
                </Accordion>
                <Button variant="light" className="mt-3" id="addOptionButton" onClick={handleAddOption}>
                  Adicionar opção
                </Button>
              </Form>
              <Button variant="success" type="submit" className="mt-3">
                Salvar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
