import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Tag } from "../types";
import { useState, useEffect } from "react";
import { addTag } from "../database/tag";

interface TagCreateProps {
  fetchData: () => Promise<void>;
}

const TagCreate: React.FC<TagCreateProps> = ({ fetchData }) => {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#000000");

  // Gera cor aleatória
  const generateRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Salvar Tag
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novaTag: Tag = {
      nome,
      cor,
    };

    await addTag(novaTag);
    setNome("");
    setCor(generateRandomColor()); // Gera nova cor após criação

    fetchData();
  };
  
  // Construtor do componente
  useEffect(() => {
    setCor(generateRandomColor());
  }, []);

  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={12} md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome da tag"
                  />
                </Form.Group>

                <Form.Group controlId="cor" className="mt-2">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control type="color" value={cor} onChange={(e) => setCor(e.target.value)} />
                </Form.Group>

                <Button type="submit" variant="success" className="mt-3">
                  Criar
                </Button>
              </Form>

              <h5 className="mt-4">Pré-visualização:</h5>
              <span id="preview" className="badge" style={{ backgroundColor: cor, color: "white" }}>
                {nome || "Nome do Badge"}
              </span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TagCreate;
