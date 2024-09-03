import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

export const QuizEditor: React.FC = () => {
  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Digite o nome do questionário" />
                </Form.Group>
                <Form.Group className="mt-3">
                  <h1 className="fs-5">Perguntas</h1>
                  {["Pergunta 1", "Pergunta 2", "Pergunta 3", "Pergunta 4"].map((question, index) => (
                    <div key={index} className="d-flex align-items-center mt-2">
                      <Form.Check type="checkbox" id={question} label={question} />
                    </div>
                  ))}
                </Form.Group>
                <Button variant="success" type="submit">
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
