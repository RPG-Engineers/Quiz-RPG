import { faTags, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card, Container, Form, useAccordionButton } from "react-bootstrap";
import { TagSelection } from "./TagSelection";
import { useState, useEffect } from "react";
import { Tag } from "../types";

export interface AlternativeCreateProps {
  id: string;
  placeholder: string;
  eventKey: string;
  tags: Tag[];
  onRemove: () => void;
  onTextChange: (id: string, text: string) => void;
  onTagChange: (id: string, selectedTags: Set<number>) => void;
  initialText?: string;
  initialTags?: Set<number>;
}

export const AlternativeCreate: React.FC<AlternativeCreateProps> = ({
  id,
  tags,
  eventKey,
  placeholder,
  onRemove,
  onTextChange,
  onTagChange,
  initialText = "",
  initialTags = new Set(),
}) => {
  const [text, setText] = useState(initialText);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(initialTags);

  // Construtor do Componente
  useEffect(() => {
    onTagChange(id, selectedTags);
  }, [id, selectedTags, onTagChange]);

  // Funções de Manipulação da Alternativa
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onTextChange(id, event.target.value);
  };

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
            <TagSelection tags={tags} selectedTags={selectedTags} handleTagToggle={handleTagToggle} />
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
