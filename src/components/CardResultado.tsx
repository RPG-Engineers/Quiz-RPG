import React from 'react';
import { Card } from 'react-bootstrap';

enum CardType {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
}

interface CardResultadoProps {
  title: string;
  imageSrc: string;
  type: CardType;
}

const CardResultado: React.FC<CardResultadoProps> = ({ title, imageSrc, type }) => {
  return (
    <Card className={`text-center card-resultado ${type}`}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Img variant="top" src={imageSrc} alt={`Imagem ${type}`} />
      </Card.Body>
    </Card>
  );
};

export { CardResultado, CardType };
