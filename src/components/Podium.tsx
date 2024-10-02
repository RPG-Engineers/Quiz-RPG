import { Col, Container, Row } from "react-bootstrap";
import { ResultCard } from "./ResultCard";
import { CaracteristicaWithTags, CardType } from "../types";

interface PodiumProps {
  top3: CaracteristicaWithTags[];
}

const Podium: React.FC<PodiumProps> = ({ top3 }) => {
  return (
    <Container className="h-100">
      <Row>
        <Col xs={4}>
          <ResultCard
            title={top3[2]?.nome}
            imageSrc={top3[2]?.url_imagem}
            type={CardType.Bronze}
          />
        </Col>
        <Col xs={4}>
          <ResultCard
            title={top3[0]?.nome}
            imageSrc={top3[0]?.url_imagem}
            type={CardType.Gold}
          />
        </Col>
        <Col xs={4}>
          <ResultCard
            title={top3[1]?.nome}
            imageSrc={top3[1]?.url_imagem}
            type={CardType.Silver}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Podium;
