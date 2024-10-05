import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Card } from "react-bootstrap";
import { QuizMasterCard } from "../components/QuizMasterCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteQuestionario, getQuestionarios, updateQuestionario } from "../database/questionario";
import { Questionario } from "../types";

const Questionarios: React.FC = () => {
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`/criar-questionario`);
  };

  // Seleciona o "Default"
  const handleSelect = async (id: number) => {
    // Atualiza todos os questionários, removendo o "default" dos outros
    const updatedQuestionarios = questionarios.map((q) => ({
      ...q,
      default: q.id_questionario === id,
    }));

    setQuestionarios(updatedQuestionarios);
    for (const questionario of updatedQuestionarios) {
      await updateQuestionario(questionario.id_questionario!, questionario);
    }
  };

  const handleStart = (id: number) => {
    navigate(`/responder/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/editar-questionario/${id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteQuestionario(id);
    setQuestionarios((prev) => prev.filter((questionario) => questionario.id_questionario !== id));
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchData = async () => {
      const questionariosFromDB = await getQuestionarios();
      setQuestionarios(questionariosFromDB);
    };
    fetchData();
  }, []);

  return (
    <>
      <Container className="h-100 mt-3">
        <Row className="align-items-center h-100">
          <Col xs={6} className="mx-auto">
            <Card className="pt-4" onClick={() => handleCreate()}>
              <Card.Body className="text-center">
                <FontAwesomeIcon icon={faPlus} size="2x" className="text-body-secondary" />
                <p className="text-body-secondary">Criar novo questionário</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {questionarios.map((questionario) => (
        <QuizMasterCard
          key={questionario.id_questionario}
          questionario={questionario}
          onSelect={() => handleSelect(questionario.id_questionario!)}
          handleStart={handleStart}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default Questionarios;
