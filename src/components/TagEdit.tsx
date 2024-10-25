import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FormErrors, Tag } from "../types";
import { useEffect, useState } from "react";
import { getTagById, updateTag } from "../database/tag";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { handleInputChange } from "../utils/formHelpers";

interface TagEditProps {
  id: number;
}

const TagEdit: React.FC<TagEditProps> = ({ id }) => {
  const [updatedTag, setUpdatedTag] = useState<Tag>({
    nome: "",
    cor: "#000000",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: false,
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Salvar Tag
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updatedTag.nome = updatedTag.nome.trim();
    if (updatedTag.nome === "") {
      setFormErrors({ ...formErrors, nome: true });
      showToast("Nome da tag não pode ser vazio!", "danger");
    } else {
      try {
        await updateTag(id, updatedTag);
        showToast("Tag atualizada com sucesso!", "success");
        navigate("/tags");
      } catch (error) {
        setFormErrors({ ...formErrors, nome: true });
        showToast("Não foi possível atualizar, a tag já existe", "danger");
      }
    }
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      const tag = await getTagById(id);
      setUpdatedTag(tag);
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
                    name="nome"
                    value={updatedTag.nome}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        updatedTag,
                        setUpdatedTag,
                        formErrors,
                        setFormErrors
                      )
                    }
                    placeholder="Digite o nome da tag"
                    className={formErrors.nome ? "is-invalid" : ""}
                  />
                </Form.Group>

                <Form.Group controlId="cor" className="mt-2">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control
                    type="color"
                    name="cor"
                    value={updatedTag.cor}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        updatedTag,
                        setUpdatedTag,
                        formErrors,
                        setFormErrors
                      )
                    }
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="mt-3">
                  Salvar
                </Button>
              </Form>

              <h5 className="mt-4">Pré-visualização:</h5>
              <span id="preview" className="badge" style={{ backgroundColor: updatedTag.cor, color: "white" }}>
                {updatedTag.nome || "Nome do Badge"}
              </span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TagEdit;
