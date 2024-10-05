import React from "react";
import { Tag } from "../types";

interface TagComponentProps {
  tag: Tag;
  selectable: boolean;
  isSelected?: boolean; 
  onTagToggle?: (tagId: number) => void;
}

export const TagComponent: React.FC<TagComponentProps> = ({ tag, isSelected, onTagToggle, selectable }) => {
  const handleClick = () => {
    if (selectable && onTagToggle) {
      onTagToggle(tag.id_tag!);
    }
  };

  const badgeClass = selectable 
    ? `badge ${isSelected ? "text-bg-danger" : "bg-secondary-subtle"} rounded-pill` 
    : "badge";

  const customStyle = selectable ? { cursor: "pointer" } : { backgroundColor: tag.cor, color: "white" };

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
