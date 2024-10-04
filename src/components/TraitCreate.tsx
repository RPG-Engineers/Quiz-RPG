import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import {
  addCaracteristica,
  associateCaracteristicaToTags,
  deleteCaracteristica,
  getCaracteristicasByTipo,
} from "../database/caracteristica";
import { getTags } from "../database/tag";
import { Caracteristica, CaracteristicaWithTags, Tag, TipoCaracteristica } from "../types";
import { getTipo } from "../utils/util";
import { TagComponent } from "./TagComponent";
import { TagSelection } from "./TagSelection";

interface TraitCreateProps {
  tipo: TipoCaracteristica;
  handleEdit: (id: number) => void;
}

const TraitCreate: React.FC<TraitCreateProps> = ({ tipo, handleEdit }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [urlReferencia, setUrlReferencia] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaWithTags[]>([]);
  const stringTipo = getTipo(tipo) == "background" ? "o background" : "a " + getTipo(tipo);

  // Função para carregar tags e características
  const fetchTagsAndCaracteristicas = async (tipo: TipoCaracteristica) => {
    const tagsFromDB = await getTags();
    const caracteristicasFromDB = await getCaracteristicasByTipo(tipo);
    setTags(tagsFromDB);
    setCaracteristicas(caracteristicasFromDB);
  };

  // Carregar tags e características na montagem inicial do componente
  useEffect(() => {
    fetchTagsAndCaracteristicas(tipo);
  }, [tipo]);

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
    const novaCaracteristica: Caracteristica = {
      nome: nome,
      descricao: descricao,
      url_imagem: urlImagem,
      url_referencia: urlReferencia,
      tipo: tipo,
    };

    const id = await addCaracteristica(novaCaracteristica);
    await associateCaracteristicaToTags(id, selectedTags);
    setNome("");
    setDescricao("");
    setUrlImagem("");
    setUrlReferencia("");
    setSelectedTags(new Set());

    // Atualizar a listagem após adicionar um novo background
    fetchTagsAndCaracteristicas(tipo);
  };

  const handleDelete = async (id: number) => {
    await deleteCaracteristica(id);
    setCaracteristicas((prev) => prev.filter((caracteristica) => caracteristica.id_caracteristica !== id));
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
                      placeholder={`Digite o nome d${stringTipo}`}
                    />
                  </Form.Group>

                  <Form.Group controlId="descricao" className="mt-2">
                    <Form.Label>Breve Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder={`Breve descrição d${stringTipo}`}
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
                    Criar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="align-items-center h-100 mt-4">
          <Col xs={12} md={6} className="mx-auto">
            {caracteristicas.map((caracteristica) => (
              <Card key={caracteristica.id_caracteristica} className="mb-3">
                <Row>
                  <Col md={6}>
                    <Card.Body>
                      <Card.Title>{caracteristica.nome}</Card.Title>
                      <Card.Text>{caracteristica.descricao}</Card.Text>
                      {caracteristica.tags.map((tag) => (
                        <TagComponent key={tag.id_tag} selectable={false} tag={tag} />
                      ))}
                    </Card.Body>
                  </Col>
                  <Col md={4}>
                    <Card.Img src={caracteristica.url_imagem} alt={caracteristica.nome} />
                  </Col>
                  <Col md={2} className="d-flex flex-column justify-content-center align-items-center">
                    <Button
                      variant="warning"
                      className="mt-3 text-white"
                      onClick={() => handleEdit(caracteristica.id_caracteristica ?? -1)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                    <Button
                      variant="danger"
                      className="mt-3"
                      onClick={() => handleDelete(caracteristica.id_caracteristica ?? -1)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TraitCreate;
