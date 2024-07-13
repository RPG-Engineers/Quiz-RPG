import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { Caracteristica, TipoCaracteristica } from '../types';
import { getCaracteristicas } from '../database/database';


const Caracteristicas: React.FC = () => {
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      const fetchedCaracteristicas = await getCaracteristicas();
      setCaracteristicas(fetchedCaracteristicas);
    };

    fetchCaracteristicas();
  }, []);

  const renderCards = (tipo: TipoCaracteristica) => {
    return caracteristicas
      .filter(caracteristica => caracteristica.tipo === tipo)
      .map((caracteristica) => (
        <div key={caracteristica.id} className="col-md-4 mb-4">
          <div className="card mb-3" style={{ maxWidth: '540px' }}>
            <div className="row no-gutters">
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{caracteristica.nome}</h5>
                  <p className="card-text">{caracteristica.descricaco}</p>
                  <span className="badge bg-secondary">{TipoCaracteristica[caracteristica.tipo]}</span>
                </div>
              </div>
              <div className="col-md-4">
                <img 
                  src={caracteristica.url_imagem} 
                  className="card-img" 
                  alt={caracteristica.nome} 
                />
              </div>
            </div>
          </div>
        </div>
      ));
  };

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
      
      <div className="container mt-5">
        <div className="row">
          {renderCards(TipoCaracteristica.CLASSE)}
        </div>
      </div>

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Raças</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>
      
      <div className="container mt-5">
        <div className="row">
          {renderCards(TipoCaracteristica.RACA)}
        </div>
      </div>

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Backgrounds</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>
      
      <div className="container mt-5">
        <div className="row">
          {renderCards(TipoCaracteristica.BACKGROUND)}
        </div>
      </div>
    </>
  );
};

export default Caracteristicas;
