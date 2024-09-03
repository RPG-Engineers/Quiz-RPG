import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

export const CardQuiz: React.FC<{ title: string; checked: boolean }> = ({ title, checked }) => {
  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Form.Check
                type="switch"
                id={`flexSwitch${title.replace(/\s+/g, "")}`}
                label="Default"
                defaultChecked={checked}
              />
              <div className="d-flex gap-1">
                <Button variant="dark" className="mt-2">
                  Iniciar
                </Button>
                <Button variant="warning" className="mt-2 text-white">
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button variant="danger" className="mt-2">
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
