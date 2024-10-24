import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Tag } from "../types";

interface TagMasterCardProps {
  tag: Tag;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

const TagMasterCard: React.FC<TagMasterCardProps> = ({ tag, handleEdit, handleDelete }) => {
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
                <Button variant="danger" onClick={() => handleDelete(tag.id_tag!)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TagMasterCard;
