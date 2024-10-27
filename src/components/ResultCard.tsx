import React from "react";
import { Card } from "react-bootstrap";
import { CardType } from "../types";
import silhueta from "../assets/img/silhueta.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

interface ResultCardProps {
  title: string;
  imageSrc: string | undefined;
  type: CardType;
  placement: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, imageSrc, type, placement }) => {
  return (
    <Card className={`text-center card-resultado ${type}`}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Img variant="top" src={imageSrc || silhueta} alt={`Imagem ${type}`} />

        {/* Centralizar o ícone e o número */}
        <div className="trophy-container">
          <div className="laurel-background"></div>
          <FontAwesomeIcon icon={faTrophy} className={`trophy-icon ${type}`} />
          <span className="placement-number">{placement}</span>
        </div>
      </Card.Body>
    </Card>
  );
};
