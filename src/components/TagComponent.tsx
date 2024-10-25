import React from "react";
import { Tag } from "../types";

interface TagComponentProps {
  tag: Tag;
  isSelected?: boolean; 
  onTagToggle?: (tagId: number) => void;
}

export const TagComponent: React.FC<TagComponentProps> = ({ tag, isSelected, onTagToggle }) => {
  const handleClick = () => {
    if (onTagToggle) {
      onTagToggle(tag.id_tag!);
    }
  };

  const badgeClass = onTagToggle 
    ? `badge ${isSelected ? "" : "bg-secondary-subtle"} rounded-pill` 
    : "badge";

  const customStyle = onTagToggle 
    ? { cursor: "pointer", backgroundColor: tag.cor, color: "white" } 
    : { backgroundColor: tag.cor, color: "white" };

  return (
    <span
      key={tag.id_tag}
      className={badgeClass}
      onClick={handleClick}
      style={customStyle}
    >
      {tag.nome}
    </span>
  );
};
