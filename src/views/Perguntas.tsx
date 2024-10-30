import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HintCard from "../components/HintCard";
import { QuestionCreate } from "../components/QuestionCreate";
import { QuestionMasterCard } from "../components/QuestionMasterCard";
import { deletePergunta, getPerguntas } from "../database/pergunta";
import { Pergunta } from "../types";

const Perguntas: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/editar-pergunta/${id}`);
  };

  const handleDelete = async (id: number) => {
    await deletePergunta(id);
    setPerguntas((prev) => prev.filter((pergunta) => pergunta.id_pergunta !== id));
  };

  const fetchData = async () => {
    const perguntasFromDB = await getPerguntas();
    setPerguntas(perguntasFromDB);
  };

  const filteredPerguntas = perguntas.filter((pergunta) =>
    pergunta.pergunta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HintCard>
        Você pode descrever uma situação do tipo "O que você faria?" e de acordo como o jogador se comportaria diante
        dela, qualificaria a alternativa escolhida com as tags adequadas.
      </HintCard>

      <QuestionCreate fetchData={fetchData} />

      <Container className="mt-3">
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Card>
              <Card.Body>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar perguntas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {filteredPerguntas.map((pergunta) => (
        <QuestionMasterCard
          key={pergunta.id_pergunta}
          pergunta={pergunta}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default Perguntas;
