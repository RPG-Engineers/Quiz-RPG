import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { Tag } from "../types";

interface TagMasterCardProps {
  tag: Tag;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
}

const TagMasterCard: React.FC<TagMasterCardProps> = ({ tag, handleEdit, handleDelete }) => {
  return (
    <Card key={tag.id_tag} className="mb-3">
      <Card.Body className="d-flex align-items-center justify-content-between">
        <span className="badge" style={{ backgroundColor: tag.cor, color: "white" }}>
          {tag.nome}
        </span>
        <div>
          <Button variant="warning" className="text-white" onClick={() => handleEdit(tag.id_tag!)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
          <Button variant="danger" className="ml-2" onClick={() => handleDelete(tag.id_tag!)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TagMasterCard;
