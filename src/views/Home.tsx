import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getDefaultQuiz } from "../utils/util";
import { useToast } from "../context/ToastContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [defaultQuizId, setDefaultQuizId] = useState<number | null>(null);

  // Inicia o questionário padrão
  const handleStart = () => {
    if (defaultQuizId) {
      navigate(`/responder/${defaultQuizId}`);
    } else {
      showToast("Nenhum questionário padrão encontrado.", 'warning');
    }
  };

  // Construtor do Componente
  useEffect(() => {
    const fetchDefaultQuiz = async () => {
      const id = await getDefaultQuiz();
      if(id)
      {
        setDefaultQuizId(id);
      }
    };
    fetchDefaultQuiz();
  }, []);

  return (
    <Container className="text-center vh-90">
      <Row className="justify-content-center align-items-center vh-90">
        <Col md={6}>
          <Image
            src="https://i.pinimg.com/originals/48/cb/53/48cb5349f515f6e59edc2a4de294f439.png"
            fluid
            rounded
            className="mx-auto d-block"
            alt="Logo do Quiz-RPG"
            style={{ maxHeight: "50vh", objectFit: "contain" }}
          />
          <p className="mt-4 text-white">
            Bem-vindo ao Quiz-RPG, uma solução prática para ajudar jogadores de RPG a criar e personalizar personagens
            de forma rápida e eficiente. Aqui você pode responder um questionário para descobrir personagens ideais,
            explorar características como classes, raças e backgrounds, e personalizar totalmente suas opções. Exporte e
            importe dados facilmente em JSON, garantindo uma experiência flexível e precisa para cada jornada de RPG.
          </p>
          <Button variant="warning" className="rpg-button mt-4" onClick={handleStart}>
            Realizar Questionário
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
