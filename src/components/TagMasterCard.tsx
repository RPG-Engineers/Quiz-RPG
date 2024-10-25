import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Card, Col, Container, Row, Modal } from "react-bootstrap";
import { Tag } from "../types";

interface TagMasterCardProps {
  tag: Tag;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

const TagMasterCard: React.FC<TagMasterCardProps> = ({ tag, handleEdit, handleDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para abrir o modal
  const openDeleteModal = () => setShowDeleteModal(true);

  // Função para fechar o modal
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    await handleDelete(tag.id_tag!);
    closeDeleteModal(); // Fecha o modal após a exclusão
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card key={tag.id_tag}>
            <Card.Body className="d-flex align-items-center justify-content-between">
              <span className="badge" style={{ backgroundColor: tag.cor, color: "white" }}>
                {tag.nome}
              </span>
              <div className="d-flex gap-2">
                <Button variant="warning" className="text-white" onClick={() => handleEdit(tag.id_tag!)}>
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button variant="danger" onClick={openDeleteModal}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir a tag "{tag.nome}"?<br/><b>Esta ação não pode ser desfeita.</b>
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
    </Container>
  );
};

export default TagMasterCard;
