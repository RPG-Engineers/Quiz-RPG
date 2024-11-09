import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import TraitCard from "../components/TraitCard";
import { searchCaracteristicas, getCaracteristicas } from "../database/caracteristica";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";

const Caracteristicas: React.FC = () => {
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaWithTags[]>([]);
  const [termoBusca, setTermoBusca] = useState("");

  // Pesquisar Característica
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(event.target.value);
  };

  // Filtra pelo Tipo
  const filtrarPorTipo = (tipo: TipoCaracteristica) => {
    return caracteristicas.filter((caracteristica) => caracteristica.tipo === tipo);
  };
  
  // Função que verifica se há características do tipo
  const temCaracteristica = (tipo: TipoCaracteristica) => {
    return filtrarPorTipo(tipo).length > 0;
  };
  
  // Construtor do Componente
  useEffect(() => {
    const fetchCaracteristicas = async () => {
      try {
        const caracteristicasFromDB = termoBusca
          ? await searchCaracteristicas(termoBusca)
          : await getCaracteristicas();

        setCaracteristicas(caracteristicasFromDB);
      } catch (error) {
        console.error("Erro ao buscar características:", error);
      }
    };

    fetchCaracteristicas();
  }, [termoBusca]);

  return (
    <>
      <Container className="my-4">
        <Row className="align-items-center justify-content-center">
          <InputGroup className="search-bar">
            <Button disabled>
              <FontAwesomeIcon color="white" stroke="white" strokeWidth={20} icon={faMagnifyingGlass} />
            </Button>
            <FormControl
              type="text"
              placeholder="Digite uma Tag ou uma Característica para pesquisar"
              value={termoBusca}
              onChange={handleSearch}
            />
          </InputGroup>
        </Row>
      </Container>

      {temCaracteristica(TipoCaracteristica.CLASSE) && (
        <>
          <Container fluid className="d-flex justify-content-start">
            <h3 className="text-white mt-3">Classes</h3>
          </Container>
          <div className="bg-secondary">
            <hr />
          </div>
          <TraitCard tipo={TipoCaracteristica.CLASSE} caracteristicas={filtrarPorTipo(TipoCaracteristica.CLASSE)} />
        </>
      )}

      {temCaracteristica(TipoCaracteristica.RACA) && (
        <>
          <Container fluid className="d-flex justify-content-start">
            <h3 className="text-white mt-3">Raças</h3>
          </Container>
          <div className="bg-secondary">
            <hr />
          </div>
          <TraitCard tipo={TipoCaracteristica.RACA} caracteristicas={filtrarPorTipo(TipoCaracteristica.RACA)} />
        </>
      )}

      {temCaracteristica(TipoCaracteristica.BACKGROUND) && (
        <>
          <Container fluid className="d-flex justify-content-start">
            <h3 className="text-white mt-3">Backgrounds</h3>
          </Container>
          <div className="bg-secondary">
            <hr />
          </div>
          <TraitCard tipo={TipoCaracteristica.BACKGROUND} caracteristicas={filtrarPorTipo(TipoCaracteristica.BACKGROUND)} />
        </>
      )}
    </>
  );
};

export default Caracteristicas;
