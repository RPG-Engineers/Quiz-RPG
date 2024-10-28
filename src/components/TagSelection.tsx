import React from "react";
import { TagComponent } from "./TagComponent";
import { Tag } from "../types";

interface TagSelectionProps {
  tags: Tag[];
  selectedTags: Set<number>;
  handleTagToggle: (tagId: number) => void;
}

export const TagSelection: React.FC<TagSelectionProps> = ({ tags, selectedTags, handleTagToggle }) => {
  // Ordena os tags em ordem alfabética pelo nome
  const sortedTags = [...tags].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <div className="d-flex gap-1 flex-wrap badge-container mt-1">
      {sortedTags.map((tag) => (
        <TagComponent
          key={tag.id_tag}
          tag={tag}
          isSelected={selectedTags.has(tag.id_tag!)}
          onTagToggle={handleTagToggle}
        />
      ))}
    </div>
  );
};
