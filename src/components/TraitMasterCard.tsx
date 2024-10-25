import React, { useState } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para abrir o modal
  const openDeleteModal = () => setShowDeleteModal(true);

  // Função para fechar o modal
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    await handleDelete(caracteristica.id_caracteristica!);
    closeDeleteModal(); // Fecha o modal após exclusão
  };

  return (
    <>
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
            <Button variant="danger" className="mt-3" onClick={openDeleteModal}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir a característica "{caracteristica.nome}"?<br/><b>Esta ação não pode ser desfeita.</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TraitMasterCard;
