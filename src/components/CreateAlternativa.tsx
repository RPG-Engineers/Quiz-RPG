import { faTags, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card, Container, Form, useAccordionButton } from "react-bootstrap";
import { TagSelection } from "./TagSelection";
import { useState } from "react";
import { Tag } from "../types";

export interface CreateAlternativaProps {
  id: string;
  placeholder: string;
  eventKey: string;
  tags: Tag[];
  onRemove: () => void;
}

export const CreateAlternativa: React.FC<CreateAlternativaProps> = ({ tags, eventKey, placeholder, onRemove }) => {
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());

  const handleTagToggle = (id: number) => {
    setSelectedTags((prev) => {
      const newSelectedTags = new Set(prev);
      if (newSelectedTags.has(id)) {
        newSelectedTags.delete(id);
      } else {
        newSelectedTags.add(id);
      }
      return newSelectedTags;
    });
  };

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
            <TagSelection tags={tags} selectedTags={selectedTags} handleTagToggle={handleTagToggle}></TagSelection>
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
