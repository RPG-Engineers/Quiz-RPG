import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

interface HintCardProps {
  className?: string;
  children: ReactNode;
}

const HintCard: React.FC<HintCardProps> = ({ className = "mt-3", children }) => {
  return (
    <Container className={className}>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body className="d-flex align-items-center">
              <FontAwesomeIcon icon={faLightbulb} size="xl" color="#7f8387" className="me-3" />
              <div><strong className="fs-5">Dica</strong><br/>{children}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HintCard;
