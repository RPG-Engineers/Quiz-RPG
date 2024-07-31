import React, { useState, useEffect } from "react";
import { getTagById, updateTag } from "../database/database";
import { Tag } from "../types";
import { useParams, useNavigate } from "react-router-dom";

const EditarTag: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nome, setNome] = useState("");
    const [cor, setCor] = useState("#000000");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTagData = async () => {
            const tag = await getTagById(Number(id));
            setNome(tag.name);
            setCor(tag.color);
        };

        fetchTagData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTag: Tag = {
            name: nome,
            color: cor,
        };

        await updateTag(Number(id), updatedTag);
        navigate("/tags");
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
                                <button type="submit" className="btn btn-success mt-3">Salvar</button>
                            </form>
                            <h5 className="mt-4">Pré-visualização:</h5>
                            <span id="preview" className="badge" style={{ backgroundColor: cor, color: "white" }}>
                                {nome || "Nome do Badge"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarTag;
