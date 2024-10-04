import React, { useState, useEffect } from "react";
import {
  getCaracteristicaById,
  updateCaracteristica,
  updateAssociationCaracteristicaToTags,
} from "../database/caracteristica";
import { getTags, getTagsByCaracteristicaId } from "../database/tag";
import { Tag, Caracteristica, TipoCaracteristica } from "../types";
import { useNavigate } from "react-router-dom";
import { TagSelection } from "./TagSelection";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

interface TraitEditProps {
  id: number;
  tipo: TipoCaracteristica;
  navigationDestiny: string;
}

const TraitEdit: React.FC<TraitEditProps> = ({ id, tipo, navigationDestiny }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [urlReferencia, setUrlReferencia] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBackgroundData = async () => {
      const caracteristica = await getCaracteristicaById(id);
      setNome(caracteristica.nome);
      setDescricao(caracteristica.descricao);
      setUrlImagem(caracteristica.url_imagem);
      setUrlReferencia(caracteristica.url_referencia);
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

    fetchBackgroundData();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCaracteristica: Caracteristica = {
      nome: nome,
      descricao: descricao,
      url_imagem: urlImagem,
      url_referencia: urlReferencia,
      tipo: tipo,
    };

    await updateCaracteristica(id, updatedCaracteristica);
    await updateAssociationCaracteristicaToTags(id, selectedTags);
    navigate(navigationDestiny);
  };

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
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite o nome do background"
                    />
                  </Form.Group>

                  <Form.Group controlId="descricao" className="mt-2">
                    <Form.Label>Breve Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Breve descrição do background"
                    />
                  </Form.Group>

                  <Form.Group controlId="urlImagem" className="mt-2">
                    <Form.Label>URL da Imagem</Form.Label>
                    <Form.Control
                      type="text"
                      value={urlImagem}
                      onChange={(e) => setUrlImagem(e.target.value)}
                      placeholder="Digite a URL da imagem"
                    />
                  </Form.Group>

                  <Form.Group controlId="urlReferencia" className="mt-2">
                    <Form.Label>URL para Referência</Form.Label>
                    <Form.Control
                      type="text"
                      value={urlReferencia}
                      onChange={(e) => setUrlReferencia(e.target.value)}
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
