import React, { useState } from "react";
import { Container, Row, Col, Card, Accordion, useAccordionButton } from "react-bootstrap";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";
import TagList from "./TagList";
import silhueta from "../assets/img/silhueta.png";
import { useToast } from "../context/ToastContext";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TraitCardProps {
  tipo: TipoCaracteristica;
  caracteristicas: CaracteristicaWithTags[];
}

const TraitCard: React.FC<TraitCardProps> = ({ tipo, caracteristicas }) => {
  const { showToast } = useToast();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleCardClick = (caracteristica: CaracteristicaWithTags) => {
    if (caracteristica.url_referencia) {
      window.open(caracteristica.url_referencia, "_blank");
    } else {
      showToast("Esta característica não possui um link de referência.", "warning");
    }
  };

  // Componente CustomToggle com ícones do FontAwesome
  const CustomToggle = ({ eventKey }: { eventKey: string }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      setActiveKey(activeKey === eventKey ? null : eventKey)
    );

    const isExpanded = activeKey === eventKey;
    return (
      <Card.Header
        onClick={decoratedOnClick}
        className="d-flex justify-content-between align-items-center p-3 border-top"
        style={{ backgroundColor: "#f8f9fa", cursor: "pointer" }}
      >
        <span>Clique para ver a imagem</span>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </Card.Header>
    );
  };

  return (
    <Container className="mt-5">
      <Row>
        {caracteristicas
          .filter((caracteristica) => caracteristica.tipo === tipo)
          .map((caracteristica) => (
            <Col key={caracteristica.id_caracteristica} md={4} className="mb-4">
              {/* Accordion para Mobile */}
              <Accordion activeKey={activeKey} className="d-md-none">
                <Card className="mb-3" style={{ cursor: "pointer" }}>
                  <Card.Body onClick={() => handleCardClick(caracteristica)}>
                    <Card.Title>{caracteristica.nome}</Card.Title>
                    <h6>Descrição</h6>
                    <Card.Text>{caracteristica.descricao}</Card.Text>
                    <TagList tags={caracteristica.tags} />
                  </Card.Body>
                  <CustomToggle eventKey={caracteristica.id_caracteristica!.toString()} />
                  <Accordion.Collapse eventKey={caracteristica.id_caracteristica!.toString()}>
                    <Card.Body className="p-0" style={{ borderTop: "1px solid #ddd" }}>
                      <Card.Img
                        src={caracteristica.url_imagem || silhueta}
                        alt={caracteristica.nome}
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          maxHeight: "500px",
                        }}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/* Layout para Desktop */}
              <Card
                className="d-none d-md-flex mb-3"
                style={{ maxWidth: "540px", height: "300px", cursor: "pointer" }}
                onClick={() => handleCardClick(caracteristica)}
              >
                <Row style={{ height: "100%" }}>
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
