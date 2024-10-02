import React from 'react';
import { Card } from 'react-bootstrap';
import { CardType } from '../types';

interface ResultCardProps {
  title: string;
  imageSrc: string;
  type: CardType;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, imageSrc, type }) => {
  return (
    <Card className={`text-center card-resultado ${type}`}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Img variant="top" src={imageSrc} alt={`Imagem ${type}`} />
      </Card.Body>
    </Card>
  );
};

