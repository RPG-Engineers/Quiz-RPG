import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TraitCreate from "../components/TraitCreate";
import TraitMasterCard from "../components/TraitMasterCard";
import { deleteCaracteristica, getCaracteristicasByTipo, searchCaracteristicasByTipo } from "../database/caracteristica";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";

interface TraitContainerProps {
  tipo: TipoCaracteristica;
  editPath: (id: number) => string;
  title: string;
}

const TraitContainer: React.FC<TraitContainerProps> = ({ tipo, editPath, title }) => {
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaWithTags[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(editPath(id));
  };

  const handleDelete = async (id: number) => {
    await deleteCaracteristica(id);
    setCaracteristicas((prev) => prev.filter((caracteristica) => caracteristica.id_caracteristica !== id));
  };

  const handleSearch = async (termo: string) => {
    if (termo) {
      const filteredCaracteristicas = await searchCaracteristicasByTipo(termo, tipo);
      setCaracteristicas(filteredCaracteristicas);
    } else {
      await fetchData(tipo);
    }
  };

  const fetchData = async (tipo: TipoCaracteristica) => {
    const caracteristicasFromDB = await getCaracteristicasByTipo(tipo);
    setCaracteristicas(caracteristicasFromDB);
  };

  useEffect(() => {
    fetchData(tipo);
  }, [tipo]);

  return (
    <Container className="h-100 mt-3">
      <TraitCreate tipo={tipo} fetchData={fetchData} />

      <Row className="align-items-center h-100 mt-4">
        <Col xs={12} md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={`Buscar ${title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default TraitContainer;
