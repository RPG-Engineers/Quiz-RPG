import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type TagCreationCardProps = {
  onCreate: (name: string, color: string) => void;
};

const TagCreationCard: React.FC<TagCreationCardProps> = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(name, color);
    setName('');
    setColor('#ffffff');
  };

  return (
    <div className="col-md-6 mx-auto my-3">
      <div className="card bg-white text-dark">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Digite o nome da tag"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3 d-flex align-items-center">
              <label htmlFor="color" className="me-2">Cor</label>
              <input
                type="color"
                className="form-control form-control-color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Criar</button>
          </form>
          <h5 className="mt-4">Pré-visualização:</h5>
          <span className="badge" style={{ backgroundColor: color, color: '#ffffff' }}>
            {name || 'Nome da Tag'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TagCreationCard;
