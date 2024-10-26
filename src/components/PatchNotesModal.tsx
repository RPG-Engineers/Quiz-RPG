import { Modal, Button } from "react-bootstrap";

interface PatchNotesModalProps {
  notes: string;
  onClose: () => void;
  show: boolean;
}

const PatchNotesModal: React.FC<PatchNotesModalProps> = ({ notes, onClose, show }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Novas Atualizações</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{notes}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Fechar</Button>
    </Modal.Footer>
  </Modal>
);

export default PatchNotesModal;
