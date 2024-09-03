import { Button, Col, Container, ProgressBar, Row } from "react-bootstrap";
import QuestionCard from "../components/QuestionCard";

export const Responder: React.FC = () => {
  return (
<Container className="h-100 mt-3">
      {/* Barra de progresso no topo */}
      <ProgressBar now={75} label="75%" className="mb-4" />

      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          {/* Pergunta 1 */}
          <QuestionCard 
            title="Pergunta 1"
            name="alternativas1"
            alternativas={[
              { id: "alternativa1", label: "Alternativa 1" },
              { id: "alternativa2", label: "Alternativa 2" },
              { id: "alternativa3", label: "Alternativa 3" },
              { id: "alternativa4", label: "Alternativa 4" }
            ]}
          />

          {/* Pergunta 2 */}
          <QuestionCard
            title="Pergunta 2"
            name="alternativas2"
            alternativas={[
              { id: "alternativa5", label: "Alternativa 1" },
              { id: "alternativa6", label: "Alternativa 2" },
              { id: "alternativa7", label: "Alternativa 3" },
              { id: "alternativa8", label: "Alternativa 4" }
            ]}
          />

          {/* Botões de Navegação */}
          <Button variant="primary" className="float-start mt-4">Voltar</Button>
          <Button variant="primary" className="float-end mt-4">Próximo</Button>
        </Col>
      </Row>
    </Container>
  );
};
