import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Card } from "react-bootstrap";
import { CardQuiz } from "../components/CardQuiz";
import { useNavigate } from "react-router-dom";

const Questionarios: React.FC = () => {
  const navigate = useNavigate();
  const handleCreate = () => {
    navigate(`/criar-questionario`);
  };
  return (
    <>
      <Container className="h-100 mt-3">
        <Row className="align-items-center h-100">
          <Col xs={6} className="mx-auto">
            <Card className="pt-4" onClick={() => handleCreate()}>
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
    </>
  );
};

export default Questionarios;
