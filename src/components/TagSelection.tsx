import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { filterTagsByName } from "../database/tag";
import { Tag } from "../types";
import { TagComponent } from "./TagComponent";

interface TagSelectionProps {
  selectedTags: Set<number>;
  handleTagToggle: (tagId: number) => void;
}

export const TagSelection: React.FC<TagSelectionProps> = ({ selectedTags, handleTagToggle }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  // Atualiza a lista de tags filtradas sempre que o termo de busca mudar
  useEffect(() => {
    const fetchFilteredTags = async () => {
      const tags = await filterTagsByName(searchTerm);
      setFilteredTags(tags);
    };
    fetchFilteredTags();
  }, [searchTerm]);

  return (
    <div>
      {/* Barra de busca */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Buscar tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Listagem de tags */}
      <div className="d-flex gap-1 flex-wrap badge-container mt-1">
        {filteredTags.map((tag) => (
          <TagComponent
            key={tag.id_tag}
            tag={tag}
            isSelected={selectedTags.has(tag.id_tag!)}
            onTagToggle={handleTagToggle}
          />
        ))}
      </div>
    </div>
  );
};
