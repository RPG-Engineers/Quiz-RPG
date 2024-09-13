import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardResultado } from '../components/CardResultado';
import { CaracteristicaWithTags } from '../types';
import { calcularResultado, getCardType } from '../utils/util';

export const Resultado: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultado, setResultado] = useState<{
    TopClasse: [CaracteristicaWithTags, number][];
    TopRaca: [CaracteristicaWithTags, number][];
    TopBackground: [CaracteristicaWithTags, number][];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!location.state || !location.state.respostas) {
        // Redireciona para a página inicial se o estado não estiver disponível
        navigate('/');
        return;
      }

      // Obtém os dados necessários
      const respostas = new Map<number, number>(location.state.respostas);
      const resultado = await calcularResultado(respostas);

      setResultado(resultado);
    };

    fetchData();
  }, [location.state, navigate]);

  if (!resultado) {
    // Exibe um carregamento ou um estado alternativo enquanto os dados estão sendo carregados
    return <div>Carregando...</div>;
  }

  const { TopClasse, TopRaca, TopBackground } = resultado;

  return (
    <>
      <div className="mt-5">
        <Container fluid className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Classes</h3>
        </Container>
        <Container className="h-100">
          <Row>
            {TopClasse.map((item, index) => (
              <Col xs={4} key={index}>
                <CardResultado
                  title={item[0].nome}
                  imageSrc={item[0].url_imagem}
                  type={getCardType(index)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Container fluid className="mt-5">
        <div className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Raças</h3>
        </div>
        <Container className="h-100">
          <Row>
            {TopRaca.map((item, index) => (
              <Col xs={4} key={index}>
                <CardResultado
                  title={item[0].nome}
                  imageSrc={item[0].url_imagem}
                  type={getCardType(index)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </Container>

      <Container fluid className="mt-5">
        <div className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Backgrounds</h3>
        </div>
        <Container className="h-100">
          <Row>
            {TopBackground.map((item, index) => (
              <Col xs={4} key={index}>
                <CardResultado
                  title={item[0].nome}
                  imageSrc={item[0].url_imagem}
                  type={getCardType(index)}
                />
              </Col>
            ))}
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
