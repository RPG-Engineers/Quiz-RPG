import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getTagById, updateTag } from "../database/tag";
import { Tag } from "../types";

const EditarTag: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#000000");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTagData = async () => {
      const tag = await getTagById(Number(id));
      setNome(tag.nome);
      setCor(tag.cor);
    };

    fetchTagData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTag: Tag = {
      nome: nome,
      cor: cor,
    };

    await updateTag(Number(id), updatedTag);
    navigate("/tags");
  };

  return (
    <div className="h-100 mt-3">
      <Container className="h-100">
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
    </div>
  );
};

export default EditarTag;
