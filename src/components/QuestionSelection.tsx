import { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Pergunta } from "../types";

interface QuestionSelectionProps {
  perguntas: Pergunta[];
  selectedPerguntas: Set<number>;
  onTogglePergunta: (id: number) => void;
}

const QuestionSelection: React.FC<QuestionSelectionProps> = ({ perguntas, selectedPerguntas, onTogglePergunta }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPerguntas, setFilteredPerguntas] = useState<Pergunta[]>(perguntas);

  // Filtra as perguntas com base no termo de busca
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredPerguntas(
      perguntas.filter((pergunta) =>
        pergunta.pergunta.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [searchTerm, perguntas]);

  return (
    <div>
      {/* Barra de busca */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Buscar perguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Listagem de perguntas */}
      {filteredPerguntas.map((pergunta) => (
        <div key={pergunta.id_pergunta} className="d-flex align-items-center mt-2">
          <Form.Check
            type="checkbox"
            id={pergunta.id_pergunta!.toString()}
            label={pergunta.pergunta}
            checked={selectedPerguntas.has(pergunta.id_pergunta!)}
            onChange={() => onTogglePergunta(pergunta.id_pergunta!)}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionSelection;
