import React, { useState, useEffect } from "react";
import { addCaracteristica, getCaracteristicas, getTags, deleteCaracteristica } from "../database/database";
import { Tag, Caracteristica, TipoCaracteristica } from "../types";
import { useNavigate } from "react-router-dom";

const Backgrounds: React.FC = () => {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [urlImagem, setUrlImagem] = useState("");
    const [urlReferencia, setUrlReferencia] = useState("");
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
    const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
    const navigate = useNavigate();

    // Função para carregar tags e características
    const fetchTagsAndCaracteristicas = async () => {
        const tagsFromDB = await getTags();
        const caracteristicasFromDB = await getCaracteristicas();
        setTags(tagsFromDB);
        setCaracteristicas(caracteristicasFromDB);
    };

    // Carregar tags e características na montagem inicial do componente
    useEffect(() => {
        fetchTagsAndCaracteristicas();
    }, []);

    const handleTagToggle = (id: number) => {
        setSelectedTags(prev => {
            const newSelectedTags = new Set(prev);
            if (newSelectedTags.has(id)) {
                newSelectedTags.delete(id);
            } else {
                newSelectedTags.add(id);
            }
            return newSelectedTags;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const novaCaracteristica: Caracteristica = {
            nome,
            descricao,
            urlImagem,
            urlReferencia,
            tags: Array.from(selectedTags),
            tipo:TipoCaracteristica.BACKGROUND,
        };

        await addCaracteristica(novaCaracteristica);
        setNome("");
        setDescricao("");
        setUrlImagem("");
        setUrlReferencia("");
        setSelectedTags(new Set());

        // Atualizar a listagem após adicionar um novo background
        fetchTagsAndCaracteristicas();
    };

    const handleDelete = async (id: number) => {
        await deleteCaracteristica(id);
        setCaracteristicas(prev => prev.filter(caracteristica => caracteristica.id_caracteristica !== id));
    };

    const handleEdit = (id: number) => {
        navigate(`/editar-background/${id}`); // Navegar para a tela de edição
    };

    return (
        <div className="container h-100 mt-4">
            <div className="row align-items-center h-100">
                <div className="col-6 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mt-2">
                                    <label htmlFor="nome">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Digite o nome do background"
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="descricao">Breve Descrição</label>
                                    <textarea
                                        className="form-control"
                                        id="descricao"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        rows={2}
                                        placeholder="Breve descrição do background"
                                    ></textarea>
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="urlImagem">URL da Imagem</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="urlImagem"
                                        value={urlImagem}
                                        onChange={(e) => setUrlImagem(e.target.value)}
                                        placeholder="Digite a URL da imagem"
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="urlReferencia">URL para Referência</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="urlReferencia"
                                        value={urlReferencia}
                                        onChange={(e) => setUrlReferencia(e.target.value)}
                                        placeholder="Digite a URL para referência"
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Tags para Selecionar</label>
                                    <div className="badge-container mt-1">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag.id_tag}
                                                className={`badge ${selectedTags.has(tag.id_tag) ? "text-bg-danger" : "bg-secondary-subtle"} rounded-pill`}
                                                onClick={() => handleTagToggle(tag.id_tag)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-success mt-3">Criar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container h-100 mt-4">
                <div className="row align-items-center h-100">
                    <div className="col-6 mx-auto">
                        {caracteristicas.map((caracteristica) => (
                            <div key={caracteristica.id_caracteristica} className="card mb-3">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card-body">
                                            <h5 className="card-title">{caracteristica.nome}</h5>
                                            <p className="card-text">{caracteristica.descricao}</p>
                                            <span className="badge text-bg-danger">{caracteristica.tags.join(", ")}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <img src={caracteristica.urlImagem} className="card-img" alt={caracteristica.nome} />
                                    </div>
                                  
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-warning mt-3 text-white" onClick={() => handleEdit(caracteristica.id_caracteristica)}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button type="button" className="btn btn-danger mt-3" onClick={() => handleDelete(caracteristica.id_caracteristica)}>
                                            <i className="fa-solid fa-trash"></i>
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

export default Backgrounds;
