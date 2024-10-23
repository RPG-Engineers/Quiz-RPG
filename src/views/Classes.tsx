import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TraitCreate from "../components/TraitCreate";
import { deleteCaracteristica, getCaracteristicasByTipo } from "../database/caracteristica";
import { getTags } from "../database/tag";
import { CaracteristicaWithTags, Tag, TipoCaracteristica } from "../types";
import TraitMasterCard from "../components/TraitMasterCard";
import { Col, Container, Row } from "react-bootstrap";

const Classes: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaWithTags[]>([]);
  const navigate = useNavigate();

  // Editar Característica
  const handleEdit = (id: number) => {
    navigate(`/editar-background/${id}`);
  };

  // Deletar Característica
  const handleDelete = async (id: number) => {
    await deleteCaracteristica(id);
    setCaracteristicas((prev) => prev.filter((caracteristica) => caracteristica.id_caracteristica !== id));
  };

  // Função para carregar tags e características pelo tipo
  const fetchData = async (tipo: TipoCaracteristica) => {
    const tagsFromDB = await getTags();
    const caracteristicasFromDB = await getCaracteristicasByTipo(tipo);
    setTags(tagsFromDB);
    setCaracteristicas(caracteristicasFromDB);
  };

  // Construtor do Componente
  useEffect(() => {
    fetchData(TipoCaracteristica.CLASSE);
  }, []);

  return (
    <Container className="h-100 mt-3">
      <TraitCreate tags={tags} tipo={TipoCaracteristica.CLASSE} fetchData={fetchData}></TraitCreate>
      <Row className="align-items-center h-100 mt-4">
        <Col xs={12} md={6} className="mx-auto">
          {caracteristicas.map((caracteristica) => (
            <TraitMasterCard
              key={caracteristica.id_caracteristica}
              caracteristica={caracteristica}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Classes;
