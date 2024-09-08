import React, { useState, useEffect } from "react";
import { addTag, getTags, deleteTag } from "../database/tag";
import { Tag } from "../types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const Tags: React.FC = () => {
    const [nome, setNome] = useState("");
    const [cor, setCor] = useState("#000000");
    const [tags, setTags] = useState<Tag[]>([]);
    const navigate = useNavigate();

    // Função para carregar as tags
    const fetchTags = async () => {
        const tagsFromDB = await getTags();
        setTags(tagsFromDB);
    };

    // Carregar tags na montagem inicial do componente
    useEffect(() => {
        fetchTags();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const novaTag: Tag = {
            nome,
            cor,
        };

        await addTag(novaTag);
        setNome("");
        setCor("#000000");

        // Atualizar a listagem após adicionar uma nova tag
        fetchTags();
    };

    const handleDelete = async (id: number) => {
        await deleteTag(id);
        setTags((prev) => prev.filter((tag) => tag.id_tag !== id));
    };

    const handleEdit = (id: number) => {
        navigate(`/editar-tag/${id}`); // Navegar para a tela de edição
    };

    return (
        <div className="container h-100 mt-3">
            <div className="row align-items-center h-100">
                <div className="col-6 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Digite o nome da tag"
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="cor">Cor</label>
                                    <input
                                        type="color"
                                        className="form-control"
                                        id="cor"
                                        value={cor}
                                        onChange={(e) => setCor(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-success mt-3">
                                    Criar
                                </button>
                            </form>
                            <h5 className="mt-4">Pré-visualização:</h5>
                            <span id="preview" className="badge" style={{ backgroundColor: cor, color: "white" }}>
                                {nome || "Nome do Badge"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container h-100 mt-3">
                <div className="row align-items-center h-100">
                    <div className="col-6 mx-auto">
                        {tags.map((tag) => (
                            <div key={tag.id_tag} className="card mb-3">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <span className="badge" style={{ backgroundColor: tag.cor, color: "white" }}>
                                        {tag.nome}
                                    </span>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-warning text-white"
                                            // Se o id for undefined passa -1 senão passa ele mesmo
                                            onClick={() => handleEdit(tag.id_tag ?? -1)} 
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            // Se o id for undefined passa -1 senão passa ele mesmo
                                            onClick={() => handleDelete(tag.id_tag ?? -1)}  
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tags;
