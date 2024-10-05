import React from "react";
import { Card, Form } from "react-bootstrap";
import { AlternativaWithTags, Pergunta } from "../types";

interface AnswerCardProps {
  pergunta: Pergunta;
  alternativas: AlternativaWithTags[];
  onSelect: (perguntaId: number, alternativaId: number) => void;
  selectedAlternativeId?: number;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ pergunta, alternativas, onSelect, selectedAlternativeId }) => {
  // Seleciona Alternativa
  const handleSelectionChange = (altId: number) => {
    onSelect(pergunta.id_pergunta!, altId);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{pergunta.pergunta}</Card.Title>
        <Form.Group>
          {alternativas.map((alt) => (
            <Form.Check
              key={alt.id_alternativa!}
              type="radio"
              id={alt.id_alternativa!.toString()}
              label={alt.alternativa}
              name={`pergunta-${pergunta.id_pergunta}`}
              checked={alt.id_alternativa === selectedAlternativeId}
              onChange={() => handleSelectionChange(alt.id_alternativa!)}
            />
          ))}
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default AnswerCard;
