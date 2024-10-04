import React from "react";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";
import { Container, Row, Col, Card } from "react-bootstrap";
import { TagComponent } from "./TagComponent";

interface TraitCardProps {
  tipo: TipoCaracteristica;
  caracteristicas: CaracteristicaWithTags[];
}

const TraitCard: React.FC<TraitCardProps> = ({ tipo, caracteristicas }) => {
  return (
    <Container className="mt-5">
      <Row>
        {caracteristicas
          .filter((caracteristica) => caracteristica.tipo === tipo)
          .map((caracteristica) => (
            <Col key={caracteristica.id_caracteristica} md={4} className="mb-4">
              <Card className="mb-3" style={{ maxWidth: "540px", height: "300px" }}>
                <Row noGutters style={{ height: "100%" }}>
                  <Col md={8} className="d-flex flex-column">
                    <Card.Body>
                      <Card.Title>{caracteristica.nome}</Card.Title>
                      <h6>Descrição</h6>
                      <div
                        style={{
                          overflowY: "auto",
                          maxHeight: "200px",
                          scrollbarWidth: "none", // Firefox
                          msOverflowStyle: "none", // IE and Edge
                        }}
                      >
                        <Card.Text>{caracteristica.descricao}</Card.Text>
                      </div>
                      {caracteristica.tags.map((tag) => (
                        <TagComponent key={tag.id_tag} selectable={false} tag={tag} />
                      ))}
                    </Card.Body>
                  </Col>
                  <Col md={4}>
                    <Card.Img
                      src={caracteristica.url_imagem}
                      alt={caracteristica.nome}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default TraitCard;
