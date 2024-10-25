import React from "react";
import { TagComponent } from "./TagComponent";
import { Tag } from "../types";

interface TagListProps {
  tags: Tag[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div className="d-flex flex-wrap gap-2" style={{ maxHeight: "50px", overflowY: "auto" }}>
      {tags.map((tag) => (
        <TagComponent key={tag.id_tag} tag={tag} />
      ))}
    </div>
  );
};

export default TagList;
