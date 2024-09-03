import React from 'react';
import { Card, Form } from 'react-bootstrap';

interface Alternativa {
  id: string;
  label: string;
}

interface QuestionCardProps {
  title: string;
  name: string;
  alternativas: Alternativa[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, name, alternativas }) => {
  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Form.Group>
          {alternativas.map((alt) => (
            <Form.Check 
              key={alt.id} 
              type="radio" 
              name={name} 
              id={alt.id} 
              label={alt.label} 
            />
          ))}
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
