import React from "react";
import { Card } from "react-bootstrap";
import { CardType } from "../types";
import silhueta from "../assets/img/silhueta.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useToast } from "../context/ToastContext";

interface ResultCardProps {
  title: string;
  imageSrc: string | undefined;
  urlReferencia: string | undefined;
  type: CardType;
  placement: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, imageSrc, type, placement, urlReferencia }) => {
  const { showToast } = useToast();

  const handleCardClick = () => {
    if (urlReferencia) {
      // Se houver um link de referência, redireciona
      window.open(urlReferencia, "_blank");
    } else {
      // Se não houver link de referência, mostra um toast de aviso
      showToast("Este resultado não possui um link de referência.", "warning");
    }
  };

  return (
    <Card className={`text-center card-resultado ${type}`} onClick={handleCardClick} style={{ cursor: "pointer" }}>
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
