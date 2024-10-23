import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { addCaracteristica, associateCaracteristicaToTags } from "../database/caracteristica";
import { Caracteristica, Tag, TipoCaracteristica } from "../types";
import { getTipo } from "../utils/util";
import { TagSelection } from "./TagSelection";

interface TraitCreateProps {
  tags: Tag[];
  tipo: TipoCaracteristica;
  fetchData: (tipo: TipoCaracteristica) => Promise<void>;
}

const TraitCreate: React.FC<TraitCreateProps> = ({ tags, tipo, fetchData }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [urlReferencia, setUrlReferencia] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const stringTipo = getTipo(tipo) == "background" ? "o background" : "a " + getTipo(tipo);

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

    fetchData(tipo);
  };

  return (
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
  );
};

export default TraitCreate;
