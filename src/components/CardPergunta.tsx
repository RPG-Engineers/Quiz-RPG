import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

interface CardPerguntaProps {
    pergunta: string
}

export const CardPergunta: React.FC<CardPerguntaProps> = ({pergunta}) => {
  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-between">
              <h1 className="fs-5 text-break">{pergunta}</h1>
              <div className="d-flex gap-2">
                <Button variant="warning" className="text-white">
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button variant="danger">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
