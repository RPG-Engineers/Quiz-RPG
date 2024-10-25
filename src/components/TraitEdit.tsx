import React, { useState, useEffect } from "react";
import {
  getCaracteristicaById,
  updateCaracteristica,
  updateAssociationCaracteristicaToTags,
} from "../database/caracteristica";
import { getTags, getTagsByCaracteristicaId } from "../database/tag";
import { Tag, Caracteristica, TipoCaracteristica, FormErrors } from "../types";
import { useNavigate } from "react-router-dom";
import { TagSelection } from "./TagSelection";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useToast } from "../context/ToastContext";
import { getTipo } from "../utils/util";
import { handleInputChange } from "../utils/formHelpers";

interface TraitEditProps {
  id: number;
  tipo: TipoCaracteristica;
  navigationDestiny: string;
}

const TraitEdit: React.FC<TraitEditProps> = ({ id, tipo, navigationDestiny }) => {
  const [updatedTrait, setUpdatedTrait] = useState<Caracteristica>({
    nome: "",
    descricao: "",
    url_imagem: "",
    url_referencia: "",
    tipo: tipo,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: false,
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const stringTipo = getTipo(tipo) == "background" ? "o background" : "a " + getTipo(tipo);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Manipulação da Tag
  const handleTagToggle = (id: number) => {
    setSelectedTags((prev) => {
      const newSelectedTags = new Set(prev);
      if (newSelectedTags.has(id)) {
        newSelectedTags.delete(id);
      } else {
        newSelectedTags.add(id);
      }
      return newSelectedTags;
    });
  };

  // Salvar Característica
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = updatedTrait.nome.trim();
    if (trimmedName === "") {
      setFormErrors({ ...formErrors, nome: true });
      showToast(`Nome d${stringTipo} não pode ser vazio!`, "danger");
    } else {
      try {
        await updateCaracteristica(id, { ...updatedTrait, nome: trimmedName });
        await updateAssociationCaracteristicaToTags(id, selectedTags);
        showToast(
          `${getTipo(tipo).charAt(0).toUpperCase() + getTipo(tipo).slice(1)} atualizada com sucesso!`,
          "success"
        );
        navigate(navigationDestiny);
      } catch (error) {
        showToast(`Não foi possível adicionar, erro: ${error}`, "danger");
      }
    }
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      const caracteristica = await getCaracteristicaById(id);
      setUpdatedTrait(caracteristica);
      const caracteristicaTags = await getTagsByCaracteristicaId(id);
      const tagIds = new Set(
        caracteristicaTags
          .map((tag) => tag.id_tag) // Mapeie para IDs
          .filter((id): id is number => id !== undefined) // Filtre IDs indefinidos
      );
      setSelectedTags(tagIds);

      const tagsFromDB = await getTags();
      setTags(tagsFromDB);
    };

    fetchData();
  }, [id]);

  return (
    <div className="h-100 mt-4">
      <Container className="h-100">
        <Row className="align-items-center h-100">
          <Col xs={12} md={6} className="mx-auto">
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="nome" className="mt-2">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={updatedTrait.nome}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          updatedTrait,
                          setUpdatedTrait,
                          formErrors,
                          setFormErrors
                        )
                      }
                      className={formErrors.nome ? "is-invalid" : ""}
                      placeholder={`Digite o nome d${stringTipo}`}
                    />
                  </Form.Group>

                  <Form.Group controlId="descricao" className="mt-2">
                    <Form.Label>Breve Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="descricao"
                      value={updatedTrait.descricao}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          updatedTrait,
                          setUpdatedTrait,
                          formErrors,
                          setFormErrors
                        )
                      }
                      placeholder="Breve descrição do background"
                    />
                  </Form.Group>

                  <Form.Group controlId="urlImagem" className="mt-2">
                    <Form.Label>URL da Imagem</Form.Label>
                    <Form.Control
                      type="text"
                      name="url_imagem"
                      value={updatedTrait.url_imagem}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          updatedTrait,
                          setUpdatedTrait,
                          formErrors,
                          setFormErrors
                        )
                      }
                      placeholder="Digite a URL da imagem"
                    />
                  </Form.Group>

                  <Form.Group controlId="urlReferencia" className="mt-2">
                    <Form.Label>URL para Referência</Form.Label>
                    <Form.Control
                      type="text"
                      name="url_referencia"
                      value={updatedTrait.url_referencia}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          updatedTrait,
                          setUpdatedTrait,
                          formErrors,
                          setFormErrors
                        )
                      }
                      placeholder="Digite a URL para referência"
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Tags para Selecionar</Form.Label>
                    <TagSelection tags={tags} selectedTags={selectedTags} handleTagToggle={handleTagToggle} />
                  </Form.Group>

                  <Button type="submit" variant="success" className="mt-3">
                    Salvar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TraitEdit;
