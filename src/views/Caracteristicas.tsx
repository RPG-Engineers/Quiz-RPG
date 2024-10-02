import React, { useEffect, useState } from "react";
import { Button, Container, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";
import TraitCard from "../components/TraitCard";
import "../assets/styles/SearchBarStyles.css";
import { filtrarCaracteristicas, getCaracteristicas } from "../database/caracteristica";

const Caracteristicas: React.FC = () => {
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaWithTags[]>([]);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      try {
        const caracteristicasFromDB = termoBusca
          ? await filtrarCaracteristicas(termoBusca)
          : await getCaracteristicas();

        setCaracteristicas(caracteristicasFromDB);
      } catch (error) {
        console.error("Erro ao buscar características:", error);
      }
    };

    fetchCaracteristicas();
  }, [termoBusca]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(event.target.value);
  };

  const filtrarPorTipo = (tipo: TipoCaracteristica) => {
    return caracteristicas.filter((caracteristica) => caracteristica.tipo === tipo);
  };

  return (
    <>
      <Container>
        <Form className="my-4">
          <Row className="align-items-center justify-content-center">
            <InputGroup className="search-bar">
              <FormControl type="text" placeholder="Digite sua pesquisa" value={termoBusca} onChange={handleSearch} />
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

      <TraitCard
        tipo={TipoCaracteristica.CLASSE}
        caracteristicas={filtrarPorTipo(TipoCaracteristica.CLASSE)}
      />

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Raças</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>

      <TraitCard tipo={TipoCaracteristica.RACA} caracteristicas={filtrarPorTipo(TipoCaracteristica.RACA)} />

      <div className="container-fluid d-flex justify-content-start">
        <h3 className="text-white mt-3">Backgrounds</h3>
      </div>
      <div className="bg-secondary">
        <hr />
      </div>

      <TraitCard
        tipo={TipoCaracteristica.BACKGROUND}
        caracteristicas={filtrarPorTipo(TipoCaracteristica.BACKGROUND)}
      />
    </>
  );
};

export default Caracteristicas;
