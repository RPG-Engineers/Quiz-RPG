import React, { useState, useEffect } from "react";
import {
  getCaracteristicaById,
  updateCaracteristica,
  updateAssociationCaracteristicaToTags
} from "../database/caracteristica";
import {
  getTags,
  getTagsByCaracteristicaId
} from "../database/tag";
import { Tag, Caracteristica, TipoCaracteristica } from "../types";
import { useNavigate } from "react-router-dom";
import { TagSelection } from "./TagSelection";

interface CaracteristicaEditorProps {
  id: number;
  tipo: TipoCaracteristica;
  navigationDestiny: string;
}

const CaracteristicaEditor: React.FC<CaracteristicaEditorProps> = ({ id, tipo, navigationDestiny }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [urlReferencia, setUrlReferencia] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBackgroundData = async () => {
      const caracteristica = await getCaracteristicaById(id);
      setNome(caracteristica.nome);
      setDescricao(caracteristica.descricao);
      setUrlImagem(caracteristica.url_imagem);
      setUrlReferencia(caracteristica.url_referencia);
      const caracteristicaTags = await getTagsByCaracteristicaId(id);
      const tagIds = new Set(
        caracteristicaTags
          .map((tag) => tag.id_tag) // Mapeie para IDs
          .filter((id): id is number => id !== undefined) // Filtre IDs indefinidos
      );
      setSelectedTags(tagIds);

      const tagsFromDB = await getTags();
      setTags(tagsFromDB);
    };

    fetchBackgroundData();
  }, [id]);

  const handleTagToggle = (id: number) => {
    setSelectedTags((prev) => {
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
      tipo: tipo,
    };

    await updateCaracteristica(id, updatedCaracteristica);
    await updateAssociationCaracteristicaToTags(id, Array.from(selectedTags));
    navigate(navigationDestiny);
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
                  <TagSelection tags={tags} selectedTags={selectedTags} handleTagToggle={handleTagToggle} />
                </div>
                <button type="submit" className="btn btn-success mt-3">
                  Salvar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaracteristicaEditor;
