import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";
import TagList from "./TagList";
import silhueta from "../assets/img/silhueta.png";

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
                  <Col md={7} className="d-flex flex-column">
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title>{caracteristica.nome}</Card.Title>
                        <h6>Descrição</h6>
                        <div
                          style={{
                            overflowY: "auto",
                            maxHeight: "150px",
                            scrollbarWidth: "thin",
                            msOverflowStyle: "none",
                          }}
                        >
                          <Card.Text>{caracteristica.descricao}</Card.Text>
                        </div>
                      </div>
                      <TagList tags={caracteristica.tags} />
                    </Card.Body>
                  </Col>
                  <Col md={5}>
                    <Card.Img
                      src={caracteristica.url_imagem || silhueta}
                      alt={caracteristica.nome}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                      }}
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