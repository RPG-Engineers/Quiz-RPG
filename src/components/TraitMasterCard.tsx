import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CaracteristicaWithTags } from "../types";
import TagList from "./TagList";
import silhueta from "../assets/img/silhueta.png";

interface TraitMasterCardProps {
  caracteristica: CaracteristicaWithTags;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

const TraitMasterCard: React.FC<TraitMasterCardProps> = ({ caracteristica, handleEdit, handleDelete }) => {
  return (
    <Card key={caracteristica.id_caracteristica} className="mb-3">
      <Row>
        <Col md={6}>
          <Card.Body>
            <Card.Title>{caracteristica.nome}</Card.Title>
            <Card.Text>{caracteristica.descricao}</Card.Text>
            <TagList tags={caracteristica.tags} />
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Img src={caracteristica.url_imagem || silhueta} alt={caracteristica.nome} />
        </Col>
        <Col md={2} className="d-flex flex-column justify-content-center align-items-center">
          <Button
            variant="warning"
            className="mt-3 text-white"
            onClick={() => handleEdit(caracteristica.id_caracteristica!)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>
          <Button variant="danger" className="mt-3" onClick={() => handleDelete(caracteristica.id_caracteristica!)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default TraitMasterCard;
