import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Podio from "../components/Podio";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";
import { calcularResultado } from "../utils/util";

export const Resultado: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultado, setResultado] = useState<[CaracteristicaWithTags, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!location.state || !location.state.respostas) {
        // Redireciona para a página inicial se o estado não estiver disponível
        navigate("/");
        return;
      }

      // Obtém os dados necessários
      const respostas = new Map<number, number>(location.state.respostas);
      const resultado = await calcularResultado(respostas);

      setResultado(resultado);
    };

    fetchData();
  }, [location.state, navigate]);

  const getTopByCategory = (resultado: [CaracteristicaWithTags, number][], tipo: TipoCaracteristica, n: number) => {
    return resultado
      .filter(([caracteristica]) => caracteristica.tipo === tipo)
      .slice(0, n)
      .map((item) => item[0]); // Pega os 3 primeiros já ordenados
  };

  return (
    <>
      <div className="mt-5">
        <Container fluid className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Classes</h3>
        </Container>
        <Podio top3={getTopByCategory(resultado, TipoCaracteristica.CLASSE, 3)} />
      </div>

      <Container fluid className="mt-5">
        <div className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Raças</h3>
        </div>
        <Podio top3={getTopByCategory(resultado, TipoCaracteristica.RACA, 3)} />
      </Container>

      <Container fluid className="mt-5">
        <div className="d-flex justify-content-center">
          <h3 className="text-white mt-3">Backgrounds</h3>
        </div>
        <Podio top3={getTopByCategory(resultado, TipoCaracteristica.BACKGROUND, 3)} />
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
