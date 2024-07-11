import React, { useState } from 'react';

interface BackgroundCreationCardProps {
    onCreate: (background: Background) => void;
}

interface Background {
    name: string;
    description: string;
    imageUrl: string;
    referenceUrl: string;
}

const BackgroundCreationCard: React.FC<BackgroundCreationCardProps> = ({ onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [referenceUrl, setReferenceUrl] = useState('');

    const handleCreate = (event: React.FormEvent) => {
        event.preventDefault();
        const newBackground: Background = { name, description, imageUrl, referenceUrl };
        onCreate(newBackground);
        setName('');
        setDescription('');
        setImageUrl('');
        setReferenceUrl('');
    };

    return (
        <div className="card bg-white text-dark">
            <div className="card-body">
                <h2 className="text-center mb-4"></h2>
                <form onSubmit={handleCreate}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do background"
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="descricao">Breve Descrição</label>
                        <textarea
                            className="form-control"
                            id="descricao"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            placeholder="Breve descrição do background"
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="urlImagem">URL da Imagem</label>
                        <input
                            type="text"
                            className="form-control"
                            id="urlImagem"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="URL da imagem do background"
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="urlReferencia">URL de Referência</label>
                        <input
                            type="text"
                            className="form-control"
                            id="urlReferencia"
                            value={referenceUrl}
                            onChange={(e) => setReferenceUrl(e.target.value)}
                            placeholder="URL de referência para o background"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Criar</button>
                </form>
            </div>
        </div>
    );
};

export default BackgroundCreationCard;
