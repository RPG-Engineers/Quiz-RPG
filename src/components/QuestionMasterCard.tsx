import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Pergunta } from "../types";

interface QuestionMasterCardProps {
  pergunta: Pergunta;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

export const QuestionMasterCard: React.FC<QuestionMasterCardProps> = ({ pergunta, handleEdit, handleDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para abrir o modal
  const openDeleteModal = () => setShowDeleteModal(true);

  // Função para fechar o modal
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    await handleDelete(pergunta.id_pergunta!);
    closeDeleteModal(); // Fecha o modal após a exclusão
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-between">
              <h1 className="fs-5 text-break">{pergunta.pergunta}</h1>
              <div className="d-flex gap-2">
                <Button variant="warning" className="text-white" onClick={() => handleEdit(pergunta.id_pergunta!)}>
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
          Tem certeza que deseja excluir a pergunta "{pergunta.pergunta}"?
          <br />
          <b>Esta ação não pode ser desfeita.</b>
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
