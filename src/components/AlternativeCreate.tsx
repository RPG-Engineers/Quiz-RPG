import { faTags, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Card, Container, Form, useAccordionButton } from "react-bootstrap";
import { TagSelection } from "./TagSelection";
import { useState, useEffect } from "react";
import { Tag } from "../types";
import HintTooltip from "./HintTooltip";

export interface AlternativeCreateProps {
  id: string;
  placeholder: string;
  eventKey: string;
  tags: Tag[];
  onRemove: () => void;
  onTextChange: (id: string, text: string) => void;
  onTagChange: (id: string, selectedTags: Set<number>) => void;
  onEnter: () => void;
  initialText?: string;
  initialTags?: Set<number>;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const AlternativeCreate: React.FC<AlternativeCreateProps> = ({
  id,
  tags,
  eventKey,
  placeholder,
  onRemove,
  onTextChange,
  onTagChange,
  onEnter,
  initialText = "", 
  initialTags = new Set(),
  inputRef,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnter();
    }
  };

  return (
    <Card>
      <Card.Header>
        <Form.Group className="d-flex gap-1">
          <Form.Control type="text" placeholder={placeholder} ref={inputRef} value={text} onKeyDown={handleKeyDown} onChange={handleTextChange} />
          <CustomToggle eventKey={eventKey}></CustomToggle>
          <Button variant="danger" className="ml-2" onClick={onRemove}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Form.Group>
      </Card.Header>
      <Accordion.Collapse eventKey={eventKey}>
        <Container className="mt-2 pb-3">
          <Form.Group>
            <Form.Label>
              Tags para Selecionar <HintTooltip>Selecione as tags mais coerentes com a alternativa</HintTooltip>
            </Form.Label>
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
