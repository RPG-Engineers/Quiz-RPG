import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface BackgroundCardProps {
  background: Background;
  onEdit: () => void;
  onDelete: () => void;
}

interface Background {
  name: string;
  description: string;
  imageUrl: string;
  referenceUrl: string;
}

const BackgroundCard: React.FC<BackgroundCardProps> = ({ background, onEdit, onDelete }) => {
  return (
    <div className="card bg-white text-dark mb-3">
      <div className="row g-0">
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{background.name}</h5>
            <p className="card-text">{background.description}</p>
            <a href={background.referenceUrl} target="_blank" rel="noopener noreferrer">Ler mais</a>
            <div className="d-flex mt-2">
              <button type="button" className="btn btn-warning text-white mx-1" onClick={onEdit}>
                <FontAwesomeIcon icon={faPencil} />
              </button>
              <button type="button" className="btn btn-danger mx-1" onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <img src={background.imageUrl} className="card-img" alt="Imagem do Background" />
        </div>
      </div>
    </div>
  );
};

export default BackgroundCard;
