import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TagMasterCard from "../components/TagMasterCard";
import { deleteTag, getTags } from "../database/tag";
import { Tag } from "../types";
import TagCreate from "../components/TagCreate";

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const navigate = useNavigate();

  // Função para carregar as tags
  const fetchData = async () => {
    const tagsFromDB = await getTags();
    setTags(tagsFromDB);
  };

  // Carregar tags na montagem inicial do componente
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/editar-tag/${id}`); // Navegar para a tela de edição
  };

  const handleDelete = async (id: number) => {
    await deleteTag(id);
    setTags((prev) => prev.filter((tag) => tag.id_tag !== id));
  };

  return (
    <>
      <TagCreate fetchData={fetchData} />
      {tags.map((tag) => (
        <TagMasterCard key={tag.id_tag} tag={tag} handleEdit={handleEdit} handleDelete={handleDelete} />
      ))}
    </>
  );
};

export default Tags;
