import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addTag, deleteTag, getTags } from "../database/tag";
import { Tag } from "../types";

const Tags: React.FC = () => {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#000000");
  const [tags, setTags] = useState<Tag[]>([]);
  const navigate = useNavigate();

  // Função para carregar as tags
  const fetchTags = async () => {
    const tagsFromDB = await getTags();
    setTags(tagsFromDB);
  };

  // Carregar tags na montagem inicial do componente
  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novaTag: Tag = {
      nome,
      cor,
    };

    await addTag(novaTag);
    setNome("");
    setCor("#000000");

    // Atualizar a listagem após adicionar uma nova tag
    fetchTags();
  };

  const handleDelete = async (id: number) => {
    await deleteTag(id);
    setTags((prev) => prev.filter((tag) => tag.id_tag !== id));
  };

  const handleEdit = (id: number) => {
    navigate(`/editar-tag/${id}`); // Navegar para a tela de edição
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

        <Row className="align-items-center h-100 mt-3">
          <Col xs={12} md={6} className="mx-auto">
            {tags.map((tag) => (
              <Card key={tag.id_tag} className="mb-3">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <span className="badge" style={{ backgroundColor: tag.cor, color: "white" }}>
                    {tag.nome}
                  </span>
                  <div>
                    <Button variant="warning" className="text-white" onClick={() => handleEdit(tag.id_tag!)}>
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                    <Button variant="danger" className="ml-2" onClick={() => handleDelete(tag.id_tag!)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Tags;
