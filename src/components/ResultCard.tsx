import React from "react";
import { Card } from "react-bootstrap";
import { CardType } from "../types";
import silhueta from "../assets/img/silhueta.png";

interface ResultCardProps {
  title: string;
  imageSrc: string | undefined;
  type: CardType;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, imageSrc, type }) => {
  return (
    <Card className={`text-center card-resultado ${type}`}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Img variant="top" src={imageSrc || silhueta} alt={`Imagem ${type}`} />
      </Card.Body>
    </Card>
  );
};
