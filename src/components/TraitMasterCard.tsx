import React, { useState } from "react";
import { Card, Row, Col, Button, Modal, useAccordionButton, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Função para abrir o modal
  const openDeleteModal = () => setShowDeleteModal(true);

  // Função para fechar o modal
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    await handleDelete(caracteristica.id_caracteristica!);
    closeDeleteModal(); 
  };

  // Componente CustomToggle com ícones do FontAwesome
  const CustomToggle = ({ eventKey }: { eventKey: string }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => setActiveKey(activeKey === eventKey ? null : eventKey));
    const isExpanded = activeKey === eventKey;

    return (
      <Card.Header
        onClick={decoratedOnClick}
        className="d-flex justify-content-between align-items-center p-3 border-top"
        style={{ backgroundColor: "#f8f9fa", cursor: "pointer" }}
      >
        <span>Clique para ver a imagem</span>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </Card.Header>
    );
  };

  return (
    <>
      {/* Accordion para Mobile */}
      <Accordion activeKey={activeKey} className="d-md-none">
        <Card className="mb-3" style={{ cursor: "pointer" }}>
          <Card.Body>
            <Card.Title>{caracteristica.nome}</Card.Title>
            <h6>Descrição</h6>
            <Card.Text>{caracteristica.descricao}</Card.Text>
            <TagList tags={caracteristica.tags} />
          </Card.Body>
          <CustomToggle eventKey={caracteristica.id_caracteristica!.toString()} />
          <Accordion.Collapse eventKey={caracteristica.id_caracteristica!.toString()}>
            <Card.Body className="p-0" style={{ borderTop: "1px solid #ddd" }}>
              <Card.Img
                src={caracteristica.url_imagem || silhueta}
                alt={caracteristica.nome}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxHeight: "500px",
                }}
              />
            </Card.Body>
          </Accordion.Collapse>
          <div className="d-flex justify-content-between p-3">
            <Button
              variant="warning"
              className="flex-grow-1 text-white"
              onClick={() => handleEdit(caracteristica.id_caracteristica!)}
              style={{ marginRight: "10px" }}
            >
              <FontAwesomeIcon icon={faPen} />
            </Button>
            <Button
              variant="danger"
              className="flex-grow-1"
              onClick={openDeleteModal}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </Card>
      </Accordion>

      {/* Layout para Desktop */}
      <Card key={caracteristica.id_caracteristica} className="d-none d-md-flex mb-3">
        <Row>
          <Col md={6}>
            <Card.Body>
              <Card.Title>{caracteristica.nome}</Card.Title>
              <Card.Text>{caracteristica.descricao}</Card.Text>
              <TagList tags={caracteristica.tags} />
            </Card.Body>
          </Col>
          <Col md={4}>
            <Card.Img
              src={caracteristica.url_imagem || silhueta}
              alt={caracteristica.nome}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
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
          Tem certeza que deseja excluir a característica "{caracteristica.nome}"? 
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
    </>
  );
};

export default TraitMasterCard;
