import React from "react";
import { TagComponent } from "./TagComponent";
import { Tag } from "../types";

interface TagSelectionProps {
  tags: Tag[];
  selectedTags: Set<number>;
  handleTagToggle: (tagId: number) => void;
}

export const TagSelection: React.FC<TagSelectionProps> = ({ tags, selectedTags, handleTagToggle }) => {
  return (
    <div className="badge-container mt-1">
      {tags.map((tag) => (
        <TagComponent
          key={tag.id_tag}
          tag={tag}
          selectable={true}
          isSelected={selectedTags.has(tag.id_tag!)}
          onTagToggle={handleTagToggle}
        />
      ))}
    </div>
  );
};
