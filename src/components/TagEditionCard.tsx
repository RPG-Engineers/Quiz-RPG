import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

type TagEditionCardProps = {
  tag: { id: string; name: string; color: string };
  onSave: (id: string, name: string, color: string) => void;
  onCancel: () => void;
};

const TagEditionCard: React.FC<TagEditionCardProps> = ({ tag, onSave, onCancel }) => {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(tag.id, name, color);
  };

  return (
    <Modal show={true} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Digite o nome da tag"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mb-3 d-flex align-items-center">
            <label htmlFor="color" className="me-2">Cor</label>
            <input
              type="color"
              className="form-control form-control-color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          </div>
          <Button type="submit" className="btn btn-success w-100">Salvar</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TagEditionCard;
