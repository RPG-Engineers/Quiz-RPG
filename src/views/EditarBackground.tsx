import React, { useState, useEffect } from "react";
import { getCaracteristicaById, updateCaracteristica, getTags, getTagsByCaracteristicaId, updateAssociationCaracteristicaToTags } from "../database/database";
import { Tag, Caracteristica, TipoCaracteristica } from "../types";
import { useParams, useNavigate } from "react-router-dom";

const EditarBackground: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [urlImagem, setUrlImagem] = useState("");
    const [urlReferencia, setUrlReferencia] = useState("");
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBackgroundData = async () => {
            const background = await getCaracteristicaById(Number(id));
            setNome(background.nome);
            setDescricao(background.descricao);
            setUrlImagem(background.url_imagem);
            setUrlReferencia(background.url_referencia);
            const backgroundTags = await getTagsByCaracteristicaId(Number(id));
            const tagIds = new Set(
                backgroundTags
                    .map(tag => tag.id_tag) // Mapeie para IDs
                    .filter((id): id is number => id !== undefined) // Filtre IDs indefinidos
            );
            setSelectedTags(tagIds);

            const tagsFromDB = await getTags();
            setTags(tagsFromDB);
        };

        fetchBackgroundData();
    }, [id]);

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
        const updatedCaracteristica: Caracteristica = {
            nome: nome,
            descricao: descricao,
            url_imagem: urlImagem,
            url_referencia: urlReferencia,
            tipo:TipoCaracteristica.BACKGROUND,
        };

        await updateCaracteristica(Number(id), updatedCaracteristica);
        await updateAssociationCaracteristicaToTags(Number(id), Array.from(selectedTags))
        navigate("/backgrounds");
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
                                                className={`badge ${selectedTags.has(tag.id_tag ?? -1) ? "text-bg-danger" : "bg-secondary-subtle"} rounded-pill`}
                                                onClick={() => handleTagToggle(tag.id_tag ?? -1)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {tag.nome}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-success mt-3">Salvar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarBackground;
