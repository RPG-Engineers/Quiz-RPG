import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Questionario } from "../types";
import { useState } from "react";

interface QuizMasterCardProps {
  questionario: Questionario
  onSelect: () => void;
  handleStart: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

export const QuizMasterCard: React.FC<QuizMasterCardProps> = ({ questionario, onSelect, handleStart, handleEdit, handleDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para abrir o modal
  const openDeleteModal = () => setShowDeleteModal(true);

  // Função para fechar o modal
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    await handleDelete(questionario.id_questionario!);
    closeDeleteModal(); // Fecha o modal após a exclusão
  };

  return (
    <Container className="h-100 mt-3">
      <Row className="align-items-center h-100">
        <Col xs={6} className="mx-auto">
          <Card>
            <Card.Body>
              <Card.Title>{questionario.nome}</Card.Title>
              <Form.Check
                type="switch"
                id={`flexSwitch${questionario.nome.replace(/\s+/g, "")}`}
                label="Default"
                checked={questionario.default}
                onChange={onSelect}
              />
              <div className="d-flex gap-1">
                <Button variant="dark" className="mt-2" onClick={() => handleStart(questionario.id_questionario!)}>
                  Iniciar
                </Button>
                <Button variant="warning" className="mt-2 text-white" onClick={() => handleEdit(questionario.id_questionario!)}>
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button variant="danger" className="mt-2" onClick={openDeleteModal}>
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
          Tem certeza que deseja excluir o questionário "{questionario.nome}"?<br/><b>Esta ação não pode ser desfeita.</b>
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
