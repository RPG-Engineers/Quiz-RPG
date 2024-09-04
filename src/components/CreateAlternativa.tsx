import { faTags, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card, Container, Form, useAccordionButton } from "react-bootstrap";

export interface CreateAlternativaProps {
  eventKey: string;
  placeholder: string;
  onRemove: () => void;
}

export const CreateAlternativa: React.FC<CreateAlternativaProps> = ({ eventKey, placeholder, onRemove }) => {
  return (
    <Card>
      <Card.Header>
        <Form.Group className="d-flex gap-1">
          <Form.Control type="text" placeholder={placeholder} />
          <CustomToggle eventKey={eventKey}></CustomToggle>
          <Button variant="danger" className="ml-2" onClick={onRemove}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Form.Group>
      </Card.Header>
      <Accordion.Collapse eventKey={eventKey}>
        <Container className="mt-2">
          <Form.Group>
            <Form.Label>Tags para Selecionar</Form.Label>
            {/* Componente que mostra as Tags */}
          </Form.Group>
        </Container>
      </Accordion.Collapse>
    </Card>
  );
};

const CustomToggle: React.FC<{ eventKey: string }> = ({ eventKey }) => {
  const decoratedOnClick = useAccordionButton(eventKey);
  return (
    <Button variant="dark" onClick={decoratedOnClick} className="ml-2">
      <FontAwesomeIcon icon={faTags} />
    </Button>
  );
};
