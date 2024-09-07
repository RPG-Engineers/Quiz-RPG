import { faTags, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card, Container, Form, useAccordionButton } from "react-bootstrap";
import { TagSelection } from "./TagSelection";
import { useState, useEffect } from "react";
import { Tag } from "../types";

export interface CreateAlternativaProps {
  id: string;
  placeholder: string;
  eventKey: string;
  tags: Tag[];
  onRemove: () => void;
  onTextChange: (id: string, text: string) => void;
  onTagChange: (id: string, selectedTags: Set<number>) => void;
}

export const CreateAlternativa: React.FC<CreateAlternativaProps> = ({ id, tags, eventKey, placeholder, onRemove, onTextChange, onTagChange }) => {
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [text, setText] = useState("");

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => {
      const newSelectedTags = new Set(prev);
      if (newSelectedTags.has(tagId)) {
        newSelectedTags.delete(tagId);
      } else {
        newSelectedTags.add(tagId);
      }
      return newSelectedTags;
    });
  };

  useEffect(() => {
    onTagChange(id, selectedTags);
  }, [selectedTags]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onTextChange(id, event.target.value);
  };

  return (
    <Card>
      <Card.Header>
        <Form.Group className="d-flex gap-1">
          <Form.Control type="text" placeholder={placeholder} value={text} onChange={handleTextChange} />
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
