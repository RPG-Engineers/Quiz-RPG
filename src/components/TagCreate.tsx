import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FormErrors, Tag } from "../types";
import { useState, useEffect } from "react";
import { addTag } from "../database/tag";
import { useToast } from "../context/ToastContext";
import { handleInputChange } from "../utils/formHelpers";

interface TagCreateProps {
  fetchData: () => Promise<void>;
}

const TagCreate: React.FC<TagCreateProps> = ({ fetchData }) => {
  const [newTag, setNewTag] = useState<Tag>({
    nome: "",
    cor: "#000000",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: false,
  });
  const { showToast } = useToast();

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

    // Validação do nome
    newTag.nome = newTag.nome.trim();
    if (newTag.nome === "") {
      setFormErrors({ ...formErrors, nome: true });
      showToast("Nome da tag não pode ser vazio!", "danger");
      return;
    }

    try {
      await addTag(newTag);
      showToast("Tag adicionada com sucesso!", "success");
      setNewTag({ nome: "", cor: generateRandomColor() });
      fetchData();
    } catch (error) {
      setFormErrors({ ...formErrors, nome: true });
      showToast("Não foi possível adicionar, a tag já existe", "danger");
    }
  };

  // Construtor do componente
  useEffect(() => {
    setNewTag((prevTag) => ({ ...prevTag, cor: generateRandomColor() }));
  }, []);

  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={12} md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="tagNome">
                  <Form.Label>Nome da Tag</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={newTag.nome}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        newTag,
                        setNewTag,
                        formErrors,
                        setFormErrors
                      )
                    }
                    placeholder="Digite o nome da tag"
                    className={formErrors.nome ? "is-invalid" : ""}
                  />
                </Form.Group>

                <Form.Group controlId="tagCor" className="mt-2">
                  <Form.Label>Cor da Tag</Form.Label>
                  <Form.Control
                    type="color"
                    name="cor"
                    value={newTag.cor}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        newTag,
                        setNewTag,
                        formErrors,
                        setFormErrors
                      )
                    }
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="mt-3">
                  Criar
                </Button>
              </Form>

              <h5 className="mt-4">Pré-visualização:</h5>
              <span id="preview" className="badge" style={{ backgroundColor: newTag.cor, color: "white" }}>
                {newTag.nome || "Nome da Tag"}
              </span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TagCreate;
