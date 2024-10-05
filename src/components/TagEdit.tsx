import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Tag } from "../types";
import { useEffect, useState } from "react";
import { getTagById, updateTag } from "../database/tag";
import { useNavigate } from "react-router-dom";

interface TagEditProps {
  id: number;
}

const TagEdit: React.FC<TagEditProps> = ({ id }) => {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#000000");
  const navigate = useNavigate();
  
  // Salvar Tag
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTag: Tag = {
      nome,
      cor,
    };
    
    await updateTag(id, updatedTag);
    navigate("/tags");
  };
  
  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      const tag = await getTagById(id);
      setNome(tag.nome);
      setCor(tag.cor);
    };

    fetchData();
  }, [id]);

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
                  Salvar
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

export default TagEdit;
