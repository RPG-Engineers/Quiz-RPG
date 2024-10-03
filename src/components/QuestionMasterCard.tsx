import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Pergunta } from "../types";

interface QuestionMasterCardProps {
  pergunta: Pergunta;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

export const QuestionMasterCard: React.FC<QuestionMasterCardProps> = ({ pergunta, handleEdit, handleDelete }) => {
  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-between">
              <h1 className="fs-5 text-break">{pergunta.pergunta}</h1>
              <div className="d-flex gap-2">
                <Button variant="warning" className="text-white">
                  <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(pergunta.id_pergunta!)} />
                </Button>
                <Button variant="danger">
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(pergunta.id_pergunta!)}/>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
