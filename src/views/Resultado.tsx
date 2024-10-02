import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";
import { calcularResultado } from "../utils/util";
import Podium from "../components/Podium";
import BarChart from "../components/BarChart";

export const Resultado: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultado, setResultado] = useState<[CaracteristicaWithTags, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!location.state || !location.state.respostas) {
        navigate("/");
        return;
      }

      const respostas = new Map<number, number>(location.state.respostas);
      const resultado = await calcularResultado(respostas);

      setResultado(resultado);
    };

    fetchData();
  }, [location.state, navigate]);

  // Filtrar os top N para uma categoria específica
  const getTopByCategory = (resultado: [CaracteristicaWithTags, number][], tipo: TipoCaracteristica, n: number) => {
    return resultado.filter(([caracteristica]) => caracteristica.tipo === tipo).slice(0, n);
  };

  return (
    <>
      <div className="mt-5">
        <Container fluid className="d-flex flex-column align-items-center">
          <h3 className="text-white mt-3">Classes</h3>
          <Podium top3={getTopByCategory(resultado, TipoCaracteristica.CLASSE, 3).map((item) => item[0])} />
          <BarChart
            labels={getTopByCategory(resultado, TipoCaracteristica.CLASSE, 10).map(([caracteristica]) => caracteristica.nome)}
            dataPoints={getTopByCategory(resultado, TipoCaracteristica.CLASSE, 10).map(([, pontuacao]) => pontuacao)}
          />
        </Container>
      </div>

      <Container fluid className="mt-5">
        <div className="d-flex flex-column align-items-center">
          <h3 className="text-white mt-3">Raças</h3>
          <Podium top3={getTopByCategory(resultado, TipoCaracteristica.RACA, 3).map((item) => item[0])} />
          <BarChart
            labels={getTopByCategory(resultado, TipoCaracteristica.RACA, 10).map(([caracteristica]) => caracteristica.nome)}
            dataPoints={getTopByCategory(resultado, TipoCaracteristica.RACA, 10).map(([, pontuacao]) => pontuacao)}
          />
        </div>
      </Container>

      <Container fluid className="mt-5">
        <div className="d-flex flex-column align-items-center">
          <h3 className="text-white mt-3">Backgrounds</h3>
          <Podium top3={getTopByCategory(resultado, TipoCaracteristica.BACKGROUND, 3).map((item) => item[0])} />
          <BarChart
            labels={getTopByCategory(resultado, TipoCaracteristica.BACKGROUND, 10).map(([caracteristica]) => caracteristica.nome)}
            dataPoints={getTopByCategory(resultado, TipoCaracteristica.BACKGROUND, 10).map(([, pontuacao]) => pontuacao)}
          />
        </div>
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
