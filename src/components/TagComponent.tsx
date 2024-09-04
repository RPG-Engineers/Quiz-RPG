import React from "react";

interface TagComponentProps {
  tagId: number;
  tagName: string;
  isSelected: boolean;
  onTagToggle: (tagId: number) => void;
}

export const TagComponent: React.FC<TagComponentProps> = ({ tagId, tagName, isSelected, onTagToggle }) => {
  return (
    <span
      className={`badge ${isSelected ? "text-bg-danger" : "bg-secondary-subtle"} rounded-pill`}
      onClick={() => onTagToggle(tagId)}
      style={{ cursor: "pointer" }}
    >
      {tagName}
    </span>
  );
};
