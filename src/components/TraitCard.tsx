import React from "react";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";

interface TraitCardProps {
  tipo: TipoCaracteristica;
  caracteristicas: CaracteristicaWithTags[];
}

const TraitCard: React.FC<TraitCardProps> = ({ tipo, caracteristicas }) => {
  return (
    <div className="container mt-5">
      <div className="row">
        {caracteristicas
          .filter((caracteristica) => caracteristica.tipo === tipo)
          .map((caracteristica) => (
            <div key={caracteristica.id_caracteristica} className="col-md-4 mb-4">
              <div className="card mb-3" style={{ maxWidth: "540px", height: "300px" }}>
                <div className="row no-gutters" style={{ height: "100%" }}>
                  <div className="col-md-8 d-flex flex-column">
                    <h5 className="card-title">{caracteristica.nome}</h5>
                    <h6>Descrição</h6>
                    <div
                      className="card-body"
                      style={{
                        overflowY: "auto",
                        maxHeight: "200px",
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE and Edge
                      }}
                    >
                      <p className="card-text">{caracteristica.descricao}</p>
                    </div>
                    {caracteristica.tags.map((tag) => (
                      <span key={tag.id_tag} className="badge" style={{ backgroundColor: tag.cor, color: "white" }}>
                        {tag.nome}
                      </span>
                    ))}
                  </div>
                  <div className="col-md-4">
                    <img
                      src={caracteristica.url_imagem}
                      className="card-img"
                      alt={caracteristica.nome}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TraitCard;
