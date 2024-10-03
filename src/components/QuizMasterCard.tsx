import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Questionario } from "../types";

interface QuizMasterCardProps {
  questionario: Questionario
  onSelect: () => void;
  handleStart: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

export const QuizMasterCard: React.FC<QuizMasterCardProps> = ({ questionario, onSelect, handleStart, handleEdit, handleDelete }) => {
  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Card.Title>{questionario.nome}</Card.Title>
              <Form.Check
                type="switch"
                id={`flexSwitch${questionario.nome.replace(/\s+/g, "")}`}
                label="Default"
                checked={questionario.default}
                onChange={onSelect}
              />
              <div className="d-flex gap-1">
                <Button variant="dark" className="mt-2" onClick={() => handleStart(questionario.id_questionario!)}>
                  Iniciar
                </Button>
                <Button variant="warning" className="mt-2 text-white" onClick={() => handleEdit(questionario.id_questionario!)}>
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button variant="danger" className="mt-2" onClick={() => handleDelete(questionario.id_questionario!)}>
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
