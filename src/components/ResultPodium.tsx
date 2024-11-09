import { Col, Container, Row } from "react-bootstrap"; 
import { ResultCard } from "./ResultCard";
import { CaracteristicaWithTags, CardType } from "../types";

interface ResultPodiumProps {
  top3: CaracteristicaWithTags[];
}

const ResultPodium: React.FC<ResultPodiumProps> = ({ top3 }) => {
  return (
    <Container className="h-100">
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4} className="mb-3">
          <ResultCard
            title={top3[2]?.nome}
            imageSrc={top3[2]?.url_imagem}
            urlReferencia={top3[2]?.url_referencia}
            type={CardType.Bronze}
            placement={3}
          />
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-3">
          <ResultCard
            title={top3[0]?.nome}
            imageSrc={top3[0]?.url_imagem}
            urlReferencia={top3[0]?.url_referencia}
            type={CardType.Gold}
            placement={1}
          />
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-3">
          <ResultCard
            title={top3[1]?.nome}
            imageSrc={top3[1]?.url_imagem}
            urlReferencia={top3[1]?.url_referencia}
            type={CardType.Silver}
            placement={2}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ResultPodium;
