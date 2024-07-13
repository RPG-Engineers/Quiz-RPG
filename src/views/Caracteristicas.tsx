import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { Caracteristica, TipoCaracteristica } from '../types';
import { getCaracteristicas } from '../database/database';
import CaracteristicaCards from '../components/CaracteristicaCards';

const Caracteristicas: React.FC = () => {
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      const fetchedCaracteristicas = await getCaracteristicas();
      setCaracteristicas(fetchedCaracteristicas);
    };

    fetchCaracteristicas();
  }, []);

  return (
    <>
      <Container>
        <Form className="my-4">
          <Row className="align-items-center h-100">
            <InputGroup>
              <FormControl type="text" placeholder="Digite sua pesquisa" />
              <Button variant="outline-secondary">Pesquisar</Button>
            </InputGroup>
          </Row>
        </Form>
      </Container>

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Classes</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>
      
      <CaracteristicaCards tipo={TipoCaracteristica.CLASSE} caracteristicas={caracteristicas} />

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Raças</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>
      
      <CaracteristicaCards tipo={TipoCaracteristica.RACA} caracteristicas={caracteristicas} />

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Backgrounds</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>
      
      <CaracteristicaCards tipo={TipoCaracteristica.BACKGROUND} caracteristicas={caracteristicas} />
    </>
  );
};

export default Caracteristicas;
