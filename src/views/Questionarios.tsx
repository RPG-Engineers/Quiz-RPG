import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Card } from "react-bootstrap";
import { CreateQuiz } from "../components/CreateQuiz";
import { CardQuiz } from "../components/CardQuiz";

const Questionarios: React.FC = () => {
  return (
    <>
      <Container className="h-100 mt-3">
        <Row className="align-items-center h-100">
          <Col xs={6} className="mx-auto">
            <Card className="pt-4">
              <Card.Body className="text-center">
                <FontAwesomeIcon icon={faPlus} size="2x" className="text-body-secondary" />
                <p className="text-body-secondary">Criar novo questionário</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <CardQuiz title="Questionário Jogador" checked={true} />
      <CardQuiz title="Questionário NPC" checked={false} />
      <CreateQuiz />
    </>
  );
};

export default Questionarios;
