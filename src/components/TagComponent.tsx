import React from "react";
import { Tag } from "../types";

interface TagComponentProps {
  tag: Tag;
  selectable: boolean;
  // Se for selectable essas 2 propertys opcionais devem ser preenchidas
  isSelected?: boolean; 
  onTagToggle?: (tagId: number) => void;
}

export const TagComponent: React.FC<TagComponentProps> = ({ tag, isSelected, onTagToggle, selectable }) => {
  if (selectable) {
    return (
      <span
        key={tag.id_tag}
        className={`badge ${isSelected ? "text-bg-danger" : "bg-secondary-subtle"} rounded-pill`}
        onClick={() => onTagToggle!(tag.id_tag!)}
        style={{ cursor: "pointer" }}
      >
        {tag.nome}
      </span>
    );
  } else {
    return (
      <span key={tag.id_tag} className="badge" style={{ backgroundColor: tag.cor, color: "white" }}>
        {tag.nome}
      </span>
    );
  }
};
