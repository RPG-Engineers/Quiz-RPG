import React from "react";
import { useParams } from "react-router-dom";
import TagEdit from "../components/TagEdit";

const EditarTag: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <TagEdit id={Number(id)}></TagEdit>;
};

export default EditarTag;
