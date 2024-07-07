import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

type TagCardProps = {
  name: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
};

const TagCard: React.FC<TagCardProps> = ({ name, color, onEdit, onDelete }) => {
  return (
    <div className="col-md-6 mx-auto my-3">
      <div className="card bg-dark text-white">
        <div className="card-body d-flex align-items-center justify-content-between">
          <span className="badge" style={{ backgroundColor: color }}>{name}</span>
          <div>
            <button type="button" className="btn btn-warning text-white mx-1" onClick={onEdit}>
              <i className="fa fa-pen"></i>
            </button>
            <button type="button" className="btn btn-danger mx-1" onClick={onDelete}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagCard;
