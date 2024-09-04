import { Container, Row, Col, Button } from "react-bootstrap";
import { CardResultado, CardType } from "../components/CardResultado";

export const Resultado: React.FC = () => {
  return (
    <>
      <div className="mt-5">
        <Container fluid className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Classes</h3>
        </Container>
        <Container className="h-100">
          <Row>
            <Col xs={4}>
              <CardResultado
                title="Bárbaro"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/342/420/618/636272680339895080.png"
                type={CardType.Bronze}
              />
            </Col>
            <Col xs={4}>
              <CardResultado
                title="Bardo"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/369/420/618/636272705936709430.png"
                type={CardType.Gold}
              />
            </Col>
            <Col xs={4}>
              <CardResultado
                title="Clérigo"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/371/420/618/636272706155064423.png"
                type={CardType.Silver}
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="mt-5">
        <div className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Raças</h3>
        </div>
        <Container className="h-100">
          <Row>
            <Col xs={4}>
              <CardResultado
                title="Bárbaro"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/342/420/618/636272680339895080.png"
                type={CardType.Bronze}
              />
            </Col>
            <Col xs={4}>
              <CardResultado
                title="Bardo"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/369/420/618/636272705936709430.png"
                type={CardType.Gold}
              />
            </Col>
            <Col xs={4}>
              <CardResultado
                title="Clérigo"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/371/420/618/636272706155064423.png"
                type={CardType.Silver}
              />
            </Col>
          </Row>
        </Container>
      </Container>

      <Container fluid className="mt-5">
        <div className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Backgrounds</h3>
        </div>
        <Container className="h-100">
          <Row>
            <Col xs={4}>
              <CardResultado
                title="Bárbaro"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/342/420/618/636272680339895080.png"
                type={CardType.Bronze}
              />
            </Col>
            <Col xs={4}>
              <CardResultado
                title="Bardo"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/369/420/618/636272705936709430.png"
                type={CardType.Gold}
              />
            </Col>
            <Col xs={4}>
              <CardResultado
                title="Clérigo"
                imageSrc="https://www.dndbeyond.com/avatars/thumbnails/6/371/420/618/636272706155064423.png"
                type={CardType.Silver}
              />
            </Col>
          </Row>
        </Container>
      </Container>

      <Container fluid className="mt-5 mb-5">
        <div className="d-flex justify-content-center">
          <Button variant="primary" size="lg" onClick={() => alert("Exportado!!")}>
            Exportar Resultados
          </Button>
        </div>
      </Container>
    </>
  );
};
